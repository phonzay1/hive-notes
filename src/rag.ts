import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { searchSimilarNotes } from './search-relevant-notes';
import { getConversationHistory } from './conversation-history';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function getHiveNotes(question: string): Promise<string> {
  try {
    const searchResults = await searchSimilarNotes(question, 15);
    
    if (searchResults.length === 0) {
      return "I couldn't find any relevant hive notes to answer your question.";
    }
    
    // Format context from search results
    const context = searchResults
      .map(({date, time, weather, beekeepers, hive_id, notes, similarity}) => 
        `- date: ${date} | time: ${time} | weather: ${weather} | beekeepers: ` +
        `${beekeepers} | hive ID: ${hive_id} | notes: ${notes} ` +
        `(Similarity: ${similarity.toFixed(2)})`)
      .join('\n');

    // console.log('context: ', context);
    
    const response = await getResponse(question, context);
    return response;
  } catch (error) {
    console.error('Error in RAG:', error);
    throw error;
  }
}

async function getResponse(question: string, context: string, threadId?: string) {
  const prompt = `You are a helpful assistant helping beekeepers find information
    in their notes about their honey bee hives. Use these relevant beekeeping notes
    to inform your answer: ${context}.`;
  
  try {
    let messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: prompt
      }
    ];

    if (threadId) {
      const history = await getConversationHistory(threadId);
      messages = [...messages, ...history];
    }

    messages.push({
      role: 'user',
      content: question
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
    });

    return completion.choices[0].message.content || 'No answer found';
  } catch (err) {
    console.error(`An error occurred: ${err}`);
    throw err;
  }
}
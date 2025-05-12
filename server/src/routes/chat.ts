import { Router, RequestHandler } from 'express';
import { getHiveNotes } from '../rag';
import { addConversationEntry } from '../db/conversations';

const router = Router();

const chatHandler: RequestHandler = async (req, res, next) => {
  try {
    const body = req.body;
    
    if (!body.question) {
      res.status(400).json({ error: 'Question is required' });
      return;
    }

    if (!body.threadId) {
      res.status(400).json({ error: 'Thread ID is required' });
      return;
    }

    // Store user's question
    await addConversationEntry({
      threadId: body.threadId,
      role: 'user',
      content: body.question
    });

    // Get response from LLM
    const response = await getHiveNotes(body.question, body.threadId);

    // Store LLM's response
    await addConversationEntry({
      threadId: body.threadId,
      role: 'assistant',
      content: response
    });

    res.json({ response });
  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

router.post('/', chatHandler);

export default router; 
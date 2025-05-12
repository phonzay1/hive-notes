import { Pool } from 'pg';
import dotenv from 'dotenv';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

dotenv.config();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
});

export async function getConversationHistory(threadId: string): Promise<ChatCompletionMessageParam[]> {
  try {
    const result = await pool.query(
      `SELECT role, content 
       FROM conversations 
       WHERE thread_id = $1 
       ORDER BY timestamp ASC`,
      [threadId]
    );

    return result.rows.map(row => ({
      role: row.role as 'user' | 'assistant',
      content: row.content
    }));
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    throw error;
  } finally {
    // await pool.end();
  }
} 
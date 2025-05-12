import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
});

interface ConversationEntry {
  threadId: string;
  role: 'user' | 'assistant';
  content: string;
}

export async function addConversationEntry(entry: ConversationEntry): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO conversations (thread_id, role, content, date, timestamp)
       VALUES ($1, $2, $3, CURRENT_DATE, CURRENT_TIMESTAMP)`,
      [entry.threadId, entry.role, entry.content]
    );
  } catch (error) {
    console.error('Error adding conversation entry:', error);
    throw error;
  }
} 
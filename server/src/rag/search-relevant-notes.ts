import { Pool } from 'pg';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { SearchResult } from '../types/types';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
});

export async function searchSimilarNotes(
  query: string,
  limit: number = 15
): Promise<SearchResult[]> {
  try {
    const embedding = await generateEmbedding(query);
    
    const result = await pool.query<SearchResult>(
      `SELECT 
          date, time, weather, beekeepers, hive_id, notes,
          1 - (embedding <=> $1::vector) as similarity
        FROM hive_notes
        WHERE 1 - (embedding <=> $1::vector) > 0.3
        ORDER BY similarity DESC
        LIMIT $2`,
      [`[${embedding}]`, limit]
    );

    return result.rows;
  } catch (error) {
    console.error('Error searching notes:', error);
    throw error;
  }
}

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  return response.data[0].embedding;
}
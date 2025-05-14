export const HIVE_IDS = ['A1', 'A5', 'B4', 'B6', 'C7', 'D2', 'D8', 'E8'];

export interface SearchResult {
  date: string;
  time: string;
  weather: string;
  beekeepers: string;
  hive_id: typeof HIVE_IDS[number];
  notes: string;
  similarity: number;
}
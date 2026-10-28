export type Freq = 'high' | 'mid' | 'low';
export type Level = 'beginner' | 'intermediate' | 'advanced';
export type Accent = 'uk' | 'us';

export interface Word {
  id: string;
  word: string;
  uk: string;
  us: string;
  senses: { pos: string; zh: string; en: string }[];
  examples: { en: string; zh: string }[];
  collocations: { en: string; zh: string }[];
  family: { en: string; zh: string }[];
  synonyms: string[];
  antonyms: string[];
  tip: string;
  category: number;
  freq: Freq;
  freqRank: number | null;
  cefr: string;
  level: Level;
  ecdictIelts: boolean;
}

export interface Category {
  id: number;
  key: string;
  zh: string;
  en: string;
}

export interface VocabIndex {
  version: string;
  count: number;
  categories: Category[];
  attribution: string;
  /** counts[categoryId]["high|beginner|core"] */
  counts: Record<string, Record<string, number>>;
}

export interface Filter {
  categories: number[]; // 空陣列 = 全部
  freqs: Freq[]; // 空陣列 = 全部
  levels: Level[]; // 空陣列 = 全部
  coreOnly: boolean;
}

export type Rating = 'again' | 'hard' | 'good'; // 不認識／模糊／記得

export const FREQS: { key: Freq; zh: string }[] = [
  { key: 'high', zh: '高頻' },
  { key: 'mid', zh: '中頻' },
  { key: 'low', zh: '低頻' },
];

export const LEVELS: { key: Level; zh: string }[] = [
  { key: 'beginner', zh: '初階' },
  { key: 'intermediate', zh: '中階' },
  { key: 'advanced', zh: '進階' },
];

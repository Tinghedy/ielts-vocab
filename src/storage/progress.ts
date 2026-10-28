import { useSyncExternalStore } from 'react';
import { grade, migrate, type CardState } from '../srs/schedule';
import { today } from '../srs/day';
import type { Rating, Word } from '../types';
import { createStore } from './storage';

export type ProgressMap = Record<string, CardState>;

const progressStore = createStore<ProgressMap>('progress', {});

// 舊版的紀錄轉成新格式後寫回，原本背過的字都保留
{
  const all = progressStore.get();
  const migrated = Object.fromEntries(Object.entries(all).map(([id, s]) => [id, migrate(s)]));
  if (Object.keys(all).some((id) => migrated[id] !== all[id])) progressStore.set(migrated);
}

export function useProgress(): ProgressMap {
  return useSyncExternalStore(progressStore.subscribe, progressStore.get);
}

export function getProgress(): ProgressMap {
  return progressStore.get();
}

export function recordAnswer(word: Word, rating: Rating): CardState {
  const all = progressStore.get();
  const next = grade(all[word.id], rating, today(), word.category);
  progressStore.set({ ...all, [word.id]: next });
  return next;
}

export function replaceProgress(next: ProgressMap) {
  progressStore.set(next);
}

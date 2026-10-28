import { useSyncExternalStore } from 'react';
import type { Accent, Filter } from '../types';
import { createStore } from './storage';

export type Theme = 'system' | 'light' | 'dark';

export interface Settings {
  accent: Accent;
  theme: Theme;
  lastFilter: Filter;
}

export const DEFAULT_FILTER: Filter = { categories: [], freqs: [], levels: [], coreOnly: false };

const DEFAULTS: Settings = {
  accent: 'us',
  theme: 'system',
  lastFilter: DEFAULT_FILTER,
};

const store = createStore<Settings>('settings', DEFAULTS);
// 舊資料可能少了新加的欄位，補上預設值；已經拿掉的欄位（newPerDay）順便清掉
const { newPerDay: _removed, ...saved } = store.get() as Settings & { newPerDay?: number };
store.set({ ...DEFAULTS, ...saved });

export function useSettings(): Settings {
  return useSyncExternalStore(store.subscribe, store.get);
}

export function updateSettings(patch: Partial<Settings>) {
  store.set({ ...store.get(), ...patch });
}

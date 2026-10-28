import type { Rating, Word } from '../types';
import { isDue, type CardState } from './schedule';

/** 答「不認識」的字在這一輪裡隔幾張後再出現 */
export const REQUEUE_GAP = 5;

/**
 * 組出一輪的佇列：先放到期的複習字（逾期最久的在前），再補新字；已經會的字不出現。
 * words 要維持資料原本的詞頻順序，新字就會從最常見的開始。
 */
export function buildQueue(
  words: Word[],
  progress: Record<string, CardState>,
  day: number,
  newLimit: number,
): Word[] {
  const due: Word[] = [];
  const fresh: Word[] = [];
  for (const w of words) {
    const s = progress[w.id];
    if (!s) {
      if (fresh.length < newLimit) fresh.push(w);
    } else if (isDue(s, day)) {
      due.push(w);
    }
  }
  due.sort((a, b) => progress[a.id].d - progress[b.id].d);
  return [...due, ...fresh];
}

/** 作答後的佇列：拿掉第一張，答「不認識」的插回 REQUEUE_GAP 張之後 */
export function advanceQueue(queue: Word[], rating: Rating): Word[] {
  const [current, ...rest] = queue;
  if (rating !== 'again') return rest;
  const at = Math.min(REQUEUE_GAP, rest.length);
  return [...rest.slice(0, at), current, ...rest.slice(at)];
}

import { describe, expect, it } from 'vitest';
import type { Word } from '../types';
import type { CardState } from './schedule';
import { advanceQueue, buildQueue, REQUEUE_GAP } from './session';

const w = (id: string) => ({ id }) as Word;
const st = (d: number, k: 0 | 1 = 0): CardState => ({ c: 1, k, d, l: d - 2, n: 1, x: 0 });

describe('buildQueue', () => {
  const words = ['a', 'b', 'c', 'd', 'e'].map(w);

  it('到期字在前（逾期久的先），再補新字到上限，未到期和已經會的不出現', () => {
    const progress = { b: st(105), c: st(98), d: st(100), e: st(0, 1) };
    const q = buildQueue(words, progress, 100, 1);
    expect(q.map((x) => x.id)).toEqual(['c', 'd', 'a']);
  });

  it('新字上限 0 時只有複習字', () => {
    expect(buildQueue(words, {}, 100, 0)).toEqual([]);
  });
});

describe('advanceQueue', () => {
  const q = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(w);

  it('記得或模糊直接拿掉', () => {
    expect(advanceQueue(q, 'good').map((x) => x.id)).toEqual(['b', 'c', 'd', 'e', 'f', 'g', 'h']);
    expect(advanceQueue(q, 'hard')).toHaveLength(7);
  });

  it('不認識插回幾張之後', () => {
    const next = advanceQueue(q, 'again');
    expect(next.findIndex((x) => x.id === 'a')).toBe(REQUEUE_GAP);
    expect(next).toHaveLength(8);
  });

  it('佇列快空時插到最後', () => {
    expect(advanceQueue([w('a'), w('b')], 'again').map((x) => x.id)).toEqual(['b', 'a']);
  });
});

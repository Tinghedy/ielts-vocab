import { describe, expect, it } from 'vitest';
import { grade, isDue, isKnown, migrate, type CardState } from './schedule';

const D = 20000;

describe('grade', () => {
  it('記得就算會了，不再排複習', () => {
    const s = grade(undefined, 'good', D, 3);
    expect(s).toEqual({ c: 3, k: 1, d: 0, l: D, n: 1, x: 0 });
    expect(isKnown(s)).toBe(true);
    expect(isDue(s, D + 1000)).toBe(false);
  });

  it('不認識明天複習，模糊後天複習', () => {
    const again = grade(undefined, 'again', D, 1);
    expect(again.d).toBe(D + 1);
    expect(again.x).toBe(1);
    expect(isDue(again, D)).toBe(false);
    expect(isDue(again, D + 1)).toBe(true);
    expect(grade(undefined, 'hard', D, 1).d).toBe(D + 2);
  });

  it('複習時答記得就畢業', () => {
    const fuzzy = grade(undefined, 'hard', D, 1);
    const s = grade(fuzzy, 'good', D + 2, 1);
    expect(isKnown(s)).toBe(true);
    expect(s.n).toBe(2);
  });

  it('會了的字再答不認識，會回到複習', () => {
    const s = grade(grade(undefined, 'good', D, 1), 'again', D + 5, 1);
    expect(isKnown(s)).toBe(false);
    expect(s.d).toBe(D + 6);
  });
});

describe('migrate', () => {
  const old = (b: number) => ({ c: 1, b, d: D + 4, l: D, n: 2, x: 0 }) as unknown as CardState;

  it('舊版盒 2 以上轉成會了', () => {
    expect(migrate(old(3))).toEqual({ c: 1, k: 1, d: 0, l: D, n: 2, x: 0 });
  });

  it('舊版盒 1 保留複習日', () => {
    expect(migrate(old(1))).toEqual({ c: 1, k: 0, d: D + 4, l: D, n: 2, x: 0 });
  });

  it('新格式原樣回傳', () => {
    const s: CardState = { c: 1, k: 0, d: D, l: D, n: 1, x: 1 };
    expect(migrate(s)).toBe(s);
  });
});

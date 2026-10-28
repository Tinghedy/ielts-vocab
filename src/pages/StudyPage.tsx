import { CheckCircleIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Flashcard } from '../components/Flashcard';
import { GradeBar } from '../components/GradeBar';
import { allCategoryIds, loadCategories, loadIndex, matchesFilter } from '../data/vocabApi';
import { useAsync } from '../data/useAsync';
import { useAudio } from '../hooks/useAudio';
import { today } from '../srs/day';
import { isDue } from '../srs/schedule';
import { advanceQueue, buildQueue } from '../srs/session';
import { getProgress, recordAnswer } from '../storage/progress';
import { useSettings } from '../storage/settings';
import type { Filter, Rating, Word } from '../types';

/** 載入這一輪會用到的字：複習模式只載有到期字的主題，範圍模式載選到的主題 */
async function loadPool(mode: 'review' | 'filter', filter: Filter): Promise<Word[]> {
  const progress = getProgress();
  const day = today();
  if (mode === 'review') {
    const cats = new Set<number>();
    for (const s of Object.values(progress)) if (isDue(s, day)) cats.add(s.c);
    const words = await loadCategories([...cats]);
    return words.filter((w) => progress[w.id] && isDue(progress[w.id], day));
  }
  const cats = filter.categories.length ? filter.categories : allCategoryIds(await loadIndex());
  const words = await loadCategories(cats);
  return words.filter((w) => matchesFilter(w, filter));
}

export function StudyPage() {
  const [params] = useSearchParams();
  const mode = params.get('mode') === 'review' ? 'review' : 'filter';
  const settings = useSettings();
  // 篩選條件只在進入這一頁時讀一次，避免作答途中重建佇列
  const [filter] = useState(settings.lastFilter);
  const pool = useAsync(() => loadPool(mode, filter), [mode, filter]);

  const [queue, setQueue] = useState<Word[] | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState({ again: 0, hard: 0, good: 0 });
  const [initialSize, setInitialSize] = useState(0);
  const play = useAudio();

  const startQueue = useCallback(
    (words: Word[], newLimit: number) => {
      const q = buildQueue(words, getProgress(), today(), newLimit);
      setQueue(q);
      setInitialSize(q.length);
      setFlipped(false);
    },
    [],
  );

  useEffect(() => {
    if (pool.status === 'ok') startQueue(pool.data, mode === 'review' ? 0 : Infinity);
    // 只在資料載入完成時建一次佇列
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool]);

  const current = queue?.[0];

  const onGrade = useCallback(
    (r: Rating) => {
      if (!current) return;
      recordAnswer(current, r);
      setDone((d) => ({ ...d, [r]: d[r] + 1 }));
      setQueue((q) => (q ? advanceQueue(q, r) : q));
      setFlipped(false);
    },
    [current],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!current || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setFlipped(true);
      } else if (e.key.toLowerCase() === 'p') {
        play(current.id, current.word, settings.accent);
      } else if (flipped && ['1', '2', '3'].includes(e.key)) {
        onGrade((['again', 'hard', 'good'] as const)[Number(e.key) - 1]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, flipped, onGrade, play, settings.accent]);

  if (pool.status === 'error') return <StudyShell><p className="error">{pool.error.message}</p></StudyShell>;
  if (pool.status === 'loading' || !queue) return <StudyShell><p className="muted center">載入單字中…</p></StudyShell>;

  if (!current) {
    const answered = done.again + done.hard + done.good;
    return (
      <StudyShell>
        <div className="done">
          {answered ? <SparklesIcon className="done-icon" aria-hidden /> : <CheckCircleIcon className="done-icon" aria-hidden />}
          <h1>{answered ? '這一輪完成了' : mode === 'review' ? '今天沒有要複習的字' : '這個範圍目前沒有要學的字'}</h1>
          {answered > 0 && (
            <p className="muted">
              記得 {done.good} · 模糊 {done.hard} · 不認識 {done.again}
            </p>
          )}
          <div className="done-actions">
            <Link className="btn primary big" to="/">
              回首頁
            </Link>
          </div>
        </div>
      </StudyShell>
    );
  }

  const progressDone = Math.max(initialSize - queue.length, 0);
  const isNew = !getProgress()[current.id];

  return (
    <StudyShell progress={initialSize ? progressDone / initialSize : 0} label={`剩 ${queue.length} 張`}>
      <Flashcard
        key={current.id + ':' + queue.length}
        word={current}
        flipped={flipped}
        isNew={isNew}
        onFlip={() => setFlipped(true)}
        onSwipe={(dir) => onGrade(dir === 'right' ? 'good' : 'again')}
      />
      <GradeBar flipped={flipped} onFlip={() => setFlipped(true)} onGrade={onGrade} />
    </StudyShell>
  );
}

function StudyShell({ children, progress, label }: { children: ReactNode; progress?: number; label?: string }) {
  return (
    <div className="study">
      <header className="study-top">
        <Link to="/" className="icon-btn" aria-label="結束，回首頁">
          <XMarkIcon className="icon" aria-hidden />
        </Link>
        <span className="meter thin" aria-hidden>
          <span style={{ width: `${(progress ?? 0) * 100}%` }} />
        </span>
        <span className="small muted">{label}</span>
      </header>
      {children}
    </div>
  );
}

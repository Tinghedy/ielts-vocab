import { LightBulbIcon } from '@heroicons/react/24/outline';
import { useSwipe, type SwipeDir } from '../hooks/useSwipe';
import { useSettings } from '../storage/settings';
import type { Word } from '../types';
import { AudioButton } from './AudioButton';

const FREQ_ZH = { high: '高頻', mid: '中頻', low: '低頻' };

interface Props {
  word: Word;
  flipped: boolean;
  isNew: boolean;
  onFlip: () => void;
  onSwipe: (dir: SwipeDir) => void;
}

export function Flashcard({ word, flipped, isNew, onFlip, onSwipe }: Props) {
  const { accent } = useSettings();
  const { dx, handlers } = useSwipe(flipped, onSwipe, onFlip);
  const tilt = Math.max(-1, Math.min(1, dx / 160));

  return (
    <div
      className="card-stage"
      {...handlers}
      style={{
        transform: dx ? `translateX(${dx}px) rotate(${tilt * 6}deg)` : undefined,
        transition: dx ? 'none' : undefined,
      }}
    >
      {dx !== 0 && (
        <div className={`swipe-hint ${dx > 0 ? 'good' : 'again'}`} style={{ opacity: Math.abs(tilt) }}>
          {dx > 0 ? '記得' : '不認識'}
        </div>
      )}
      <article className={`card ${flipped ? 'flipped' : ''}`}>
        <div className="card-head">
          <div className="tags">
            {isNew && <span className="tag accent">新字</span>}
            <span className="tag">{FREQ_ZH[word.freq]}</span>
            <span className="tag">{word.cefr}</span>
            {word.ecdictIelts && <span className="tag">核心</span>}
          </div>
          <h1 className="headword" lang="en">
            {word.word}
          </h1>
          <div className="ipa-row">
            <span className="ipa" lang="en">
              {accent === 'uk' ? word.uk : word.us}
            </span>
            <AudioButton word={word} />
          </div>
        </div>

        {flipped ? (
          <div className="card-back">
            <ol className="senses">
              {word.senses.map((s, i) => (
                <li key={i}>
                  <span className="pos">{s.pos}</span> {s.zh}
                </li>
              ))}
            </ol>

            <section>
              <h2>例句</h2>
              {word.examples.map((ex, i) => (
                <div className="example" key={i}>
                  <p lang="en">{ex.en}</p>
                  <p className="muted">{ex.zh}</p>
                </div>
              ))}
            </section>

            {word.collocations.length > 0 && (
              <section>
                <h2>搭配詞</h2>
                <ul className="collocations">
                  {word.collocations.map((c, i) => (
                    <li key={i}>
                      <span lang="en">{c.en}</span>
                      <span className="muted">{c.zh}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {word.tip && (
              <p className="tip">
                <LightBulbIcon className="icon" aria-hidden />
                <span>{word.tip}</span>
              </p>
            )}
          </div>
        ) : (
          <p className="tap-hint muted">點卡片看答案</p>
        )}
      </article>
    </div>
  );
}

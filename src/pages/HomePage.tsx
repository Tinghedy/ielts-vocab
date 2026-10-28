import { AdjustmentsHorizontalIcon, ArrowPathIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { BackupPanel } from '../components/BackupPanel';
import { Layout } from '../components/Layout';
import { countByFreq, loadIndex } from '../data/vocabApi';
import { useAsync } from '../data/useAsync';
import { isDue, isKnown } from '../srs/schedule';
import { today } from '../srs/day';
import { useProgress } from '../storage/progress';
import { DEFAULT_FILTER, updateSettings } from '../storage/settings';

export function HomePage() {
  const index = useAsync(loadIndex, []);
  const progress = useProgress();
  const navigate = useNavigate();

  const day = today();
  let due = 0;
  let pending = 0;
  const known: Record<number, number> = {};
  for (const s of Object.values(progress)) {
    if (isDue(s, day)) due++;
    if (isKnown(s)) known[s.c] = (known[s.c] ?? 0) + 1;
    else pending++;
  }
  const totalKnown = Object.values(known).reduce((a, b) => a + b, 0);

  const openCategory = (id: number) => {
    updateSettings({ lastFilter: { ...DEFAULT_FILTER, categories: [id] } });
    navigate('/setup');
  };

  return (
    <Layout>
      <section className="hero">
        <p className="muted">今天要複習</p>
        <p className="hero-num">
          {due}
          <span> 個字</span>
        </p>
        <p className="muted small">
          已會 {totalKnown} 個 · 還在複習 {pending} 個
        </p>
        <div className="hero-actions">
          <button className="btn primary big" disabled={due === 0} onClick={() => navigate('/study?mode=review')}>
            <ArrowPathIcon className="icon" aria-hidden />
            {due === 0 ? '今天沒有要複習的字' : '開始複習'}
          </button>
          <Link className="btn big" to="/setup">
            <AdjustmentsHorizontalIcon className="icon" aria-hidden />
            自訂範圍學新字
          </Link>
        </div>
      </section>

      <h2 className="section-title">主題</h2>
      {index.status === 'loading' && <p className="muted">載入中…</p>}
      {index.status === 'error' && <p className="error">{index.error.message}</p>}
      {index.status === 'ok' && (
        <div className="cat-grid">
          {index.data.categories.map((c) => {
            const f = countByFreq(index.data, c.id);
            const total = f.high + f.mid + f.low;
            const m = known[c.id] ?? 0;
            return (
              <button key={c.id} className="cat-card" onClick={() => openCategory(c.id)}>
                <span className="cat-no">
                  {String(c.id).padStart(2, '0')}
                  <ChevronRightIcon className="icon" aria-hidden />
                </span>
                <span className="cat-name">{c.zh}</span>
                <span className="cat-en muted small">{c.en}</span>
                <span className="cat-freq">
                  <span>
                    高<b>{f.high}</b>
                  </span>
                  <span>
                    中<b>{f.mid}</b>
                  </span>
                  <span>
                    低<b>{f.low}</b>
                  </span>
                </span>
                <span className="meter" aria-hidden>
                  <span style={{ width: `${(m / total) * 100}%` }} />
                </span>
                <span className="small muted">
                  已會 {m} / {total}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <BackupPanel />
    </Layout>
  );
}

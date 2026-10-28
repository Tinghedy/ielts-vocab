import { PlayIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { ChipGroup } from '../components/ChipGroup';
import { Layout } from '../components/Layout';
import { Toggle } from '../components/Toggle';
import { countMatching, loadIndex } from '../data/vocabApi';
import { useAsync } from '../data/useAsync';
import { updateSettings, useSettings } from '../storage/settings';
import { FREQS, LEVELS, type Filter } from '../types';

export function SetupPage() {
  const index = useAsync(loadIndex, []);
  const { lastFilter: filter } = useSettings();
  const navigate = useNavigate();
  const set = (patch: Partial<Filter>) => updateSettings({ lastFilter: { ...filter, ...patch } });

  if (index.status !== 'ok') {
    return (
      <Layout back>
        {index.status === 'error' ? <p className="error">{index.error.message}</p> : <p className="muted">載入中…</p>}
      </Layout>
    );
  }

  const idx = index.data;
  const total = countMatching(idx, filter);

  return (
    <Layout back>
      <h1 className="page-title">選字範圍</h1>

      <ChipGroup
        label="主題"
        options={idx.categories.map((c) => ({ key: c.id, label: c.zh }))}
        value={filter.categories}
        onChange={(categories) => set({ categories })}
      />
      <ChipGroup
        label="頻率"
        options={FREQS.map((f) => ({ key: f.key, label: f.zh, hint: String(countMatching(idx, { ...filter, freqs: [f.key] })) }))}
        value={filter.freqs}
        onChange={(freqs) => set({ freqs })}
      />
      <ChipGroup
        label="難度"
        options={LEVELS.map((l) => ({ key: l.key, label: l.zh, hint: String(countMatching(idx, { ...filter, levels: [l.key] })) }))}
        value={filter.levels}
        onChange={(levels) => set({ levels })}
      />
      <Toggle
        label="只看核心字"
        hint="ECDICT 標為雅思詞彙的字"
        checked={filter.coreOnly}
        onChange={(coreOnly) => set({ coreOnly })}
      />

      <div className="sticky-cta">
        <button className="btn primary big full" disabled={total === 0} onClick={() => navigate('/study')}>
          <PlayIcon className="icon" aria-hidden />
          開始學習（共 {total} 字）
        </button>
      </div>
    </Layout>
  );
}

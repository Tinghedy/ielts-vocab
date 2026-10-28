// 把 data/ielts-vocab.json 依主題拆成 public/vocab/cat-XX.json，並產生 index.json。
// index.json 帶有每個主題 × 頻率 × 難度 × 核心字的計數，首頁和選字頁不必載入主題檔。
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcPath = join(root, 'data', 'ielts-vocab.json');
const outDir = join(root, 'public', 'vocab');

const raw = readFileSync(srcPath);
const { meta, words } = JSON.parse(raw);
const version = createHash('sha1').update(raw).digest('hex').slice(0, 8);

// 這些欄位可以從 meta 推回來，前端用不到
const DROP = ['categoryZh', 'categoryKey', 'freqZh', 'levelZh', 'sourceTopic'];

const byCat = new Map(meta.categories.map((c) => [c.id, []]));
const counts = {};
for (const w of words) {
  const slim = { ...w };
  for (const k of DROP) delete slim[k];
  byCat.get(w.category).push(slim);

  const c = (counts[w.category] ??= {});
  const key = `${w.freq}|${w.level}|${w.ecdictIelts ? 'core' : 'other'}`;
  c[key] = (c[key] ?? 0) + 1;
}

mkdirSync(outDir, { recursive: true });
let total = 0;
for (const [id, list] of byCat) {
  const json = JSON.stringify(list);
  total += json.length;
  writeFileSync(join(outDir, `cat-${String(id).padStart(2, '0')}.json`), json);
}

const index = {
  version,
  count: words.length,
  categories: meta.categories,
  attribution: meta.attribution,
  counts,
};
writeFileSync(join(outDir, 'index.json'), JSON.stringify(index));

console.log(`split-vocab: ${words.length} words → 12 files (${(total / 1e6).toFixed(2)} MB), version ${version}`);

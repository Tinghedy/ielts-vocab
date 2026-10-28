// 把 vite build 的結果和 public/vocab 的資料合成一個 HTML，雙擊就能開（file:// 不能 fetch）。
// 先跑 npm run build，再跑這支。
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const vocabDir = join(root, 'public', 'vocab');
const outPath = join(root, 'ielts-vocab.html');

// 內嵌在 <script> 裡時，字串中的 "</script" 會提早結束標籤
const safe = (s) => s.replace(/<\/(script)/gi, '<\\/$1');

const index = JSON.parse(readFileSync(join(vocabDir, 'index.json'), 'utf8'));
const cats = {};
for (const f of readdirSync(vocabDir)) {
  const m = f.match(/^cat-(\d+)\.json$/);
  if (m) cats[Number(m[1])] = JSON.parse(readFileSync(join(vocabDir, f), 'utf8'));
}

let html = readFileSync(join(dist, 'index.html'), 'utf8');

html = html.replace(/<link rel="stylesheet"[^>]*href="\.\/([^"]+)"[^>]*>/, (_, p) => {
  return `<style>${readFileSync(join(dist, p), 'utf8')}</style>`;
});

let js = '';
html = html.replace(/<script type="module"[^>]*src="\.\/([^"]+)"[^>]*><\/script>/, (_, p) => {
  js = readFileSync(join(dist, p), 'utf8');
  return '';
});
if (!js) throw new Error('找不到 build 出來的 JS，請先跑 npm run build');

// 資料要在 app 之前載入；module script 會延後到 DOM 解析完才執行，所以放在 body 最後
const data = `<script>window.__VOCAB__=${safe(JSON.stringify({ index, cats }))};</script>`;
const app = `<script type="module">${safe(js)}</script>`;
// 用函式當 replacement，避免 JS 裡的 $&、$' 被當成特殊替換字元
html = html.replace('</body>', () => `${data}\n${app}\n</body>`);

writeFileSync(outPath, html);
console.log(`build-single: ${outPath} (${(Buffer.byteLength(html) / 1e6).toFixed(1)} MB)`);

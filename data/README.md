# IELTS 單字資料集（7,298 字）

12 個主題 × 高／中／低頻 × 初／中／進階，繁體中文（台灣用語）。

## 檔案

- `ielts-vocab.json`：網站用，`{ meta, words }`，已按「主題 → 頻率 → 詞頻排名」排序
- `ielts-vocab.csv`：Excel / Anki 用（UTF-8 BOM，Excel 直接開不會亂碼）

## 每個字的欄位（`words[]`）

| 欄位 | 說明 | 例 |
|---|---|---|
| `id` / `word` | 單字 | `"cost"` |
| `uk` / `us` | 英式／美式 IPA | `"/kɒst/"` |
| `senses[]` | `{pos, zh, en}`，最多 3 個，依雅思常用度排序 | |
| `examples[]` | `{en, zh}`，2 句（一句生活、一句雅思寫作語氣） | |
| `collocations[]` | `{en, zh}` 搭配詞 | `the cost of living／生活成本` |
| `family[]` | `{en, zh}` 詞族 | `costly (adj.)` |
| `synonyms` / `antonyms` | 字串陣列（可能為空） | |
| `tip` | 用法／易混提醒 | |
| `category` / `categoryKey` / `categoryZh` | 主題 1–12 | `2` / `"business"` / `"商業、經濟與政治"` |
| `freq` / `freqZh` | `high`/`mid`/`low` | `"高頻"` |
| `freqRank` | 詞頻排名（越小越常見，`null`＝查無） | `645` |
| `cefr` | A1–C2 | `"B2"` |
| `level` / `levelZh` | `beginner`/`intermediate`/`advanced` | `"中階"` |
| `ecdictIelts` | ECDICT 是否標為雅思詞彙（3,6xx 字）——可當「核心字」篩選 | `true` |
| `sourceTopic` | 詞光原本的 19 類，留著備查 | `"economy"` |

## 主題（`meta.categories`）

| # | 主題 | 來源（詞光原分類） |
|---|---|---|
| 1 | 生物、生態與環境 | nature、environment |
| 2 | 商業、經濟與政治 | economy、work、government |
| 3 | 健康、醫藥與心理 | health、emotion |
| 4 | 科學、科技與交通 | science、technology＋travel 裡的交通工具字 |
| 5 | 考古與歷史 | history |
| 6 | 城市與建築 | city |
| 7 | 教育與語言 | education |
| 8 | 藝術、文化與人文 | arts、media |
| 9 | 天文、地科與地理 | 從 nature/science/environment 用英文釋義挑出的天文地科字＋國名洲名 |
| 10 | 日常生活 | daily、travel、sport（聽力口說重點，書裡沒有） |
| 11 | 社會議題 | society（書裡沒有） |
| 12 | 思考與表達 | thinking：assert、speculate 這類抽象學術字（書裡沒有） |

1–9 對應《雅思主題單字》目錄的 Topic 1–9。

## 分級規則

- **頻率**：取 ECDICT 的 `frq`（當代語料）與 `bnc`（英國國家語料庫）中較前的排名，這樣英式拼法（analyse、colour）不會被低估。
  - 高頻：≤ 3,000｜中頻：3,001–10,000｜低頻：> 10,000 或查無
  - 這是「英文整體使用頻率」，不是「雅思考題出現次數」。
- **難度**：CEFR A1–A2＝初階、B1–B2＝中階、C1–C2＝進階。

## 已知限制

- 主題 4、9 的重新分類是用英文釋義關鍵字自動判斷，少數字會分錯（例：encroach、teem 跑到天文地理）。
- 原始資料作者說明內容是自動檢查、未經人工逐字校對。
- 簡轉繁用 OpenCC `s2twp`（含台灣用語轉換，如 软件→軟體）。

## 授權（網站上需標示）

- 單字內容：Word Atlas contributors（词光），CC BY 4.0 — https://github.com/designfuchen/word-atlas
  （已改作：轉繁體、重新分類、加入詞頻分級）
- 詞頻：ECDICT，MIT — https://github.com/skywind3000/ECDICT
- 詞光另有插圖與英美發音 mp3（同為 CC BY 4.0），在原 repo 的 `public/atlas/`，檔名就是 `id`：`img/{id}.webp`、`thumb/{id}.webp`、`audio/uk/{id}.mp3`、`audio/us/{id}.mp3`、`audio/ex/{id}.mp3`。

## 前端小提示

```js
const { meta, words } = await fetch('/ielts-vocab.json').then(r => r.json());
const deck = words.filter(w => w.category === 1 && w.freq === 'high');
```

JSON 約 8.5 MB，gzip 後約 2.5 MB；或依 `category` 拆成 12 個檔案再按需載入。

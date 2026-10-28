# IELTS 單字

背 IELTS 單字的網站，手機優先，桌機也能用。純前端，學習紀錄存在瀏覽器的 localStorage。

- 12 個主題 × 高／中／低頻 × 初／中／進階，共 7,298 字，可只看核心字
- 單字卡：點一下翻面，翻面後右滑＝記得、左滑＝不認識，或按底部三個按鈕
- 複習規則：答「記得」就算會了，不再出現；「不認識」隔天複習、「模糊」隔兩天複習，複習時答記得就畢業
- 發音用詞光的美式音檔，抓不到時改用瀏覽器語音
- 首頁可以匯出／匯入學習紀錄，換裝置或換瀏覽器時用

## 開發

```bash
npm install
npm run dev           # 開發（會先把 data/ielts-vocab.json 拆成 public/vocab/ 的 12 個主題檔）
npm test              # 單元測試
npm run build         # 產生 dist/
npm run build:single  # 產生單一檔案 ielts-vocab.html，雙擊就能離線使用
```

push 到 `main` 後，GitHub Actions 會自動 build 並部署到 GitHub Pages。

資料欄位、分類和分級規則見 [data/README.md](data/README.md)。

## 授權

- 單字內容與發音：Word Atlas contributors（词光），[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — https://github.com/designfuchen/word-atlas
  （已改作：轉繁體、重新分類、加入詞頻分級）
- 詞頻：ECDICT，MIT — https://github.com/skywind3000/ECDICT

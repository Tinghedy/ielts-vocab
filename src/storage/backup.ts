import type { CardState } from '../srs/schedule';
import { migrate } from '../srs/schedule';
import { getProgress, replaceProgress, type ProgressMap } from './progress';

interface BackupFile {
  app: 'ielts-vocab';
  version: 1;
  exportedAt: string;
  progress: ProgressMap;
}

export function downloadBackup() {
  const data: BackupFile = {
    app: 'ielts-vocab',
    version: 1,
    exportedAt: new Date().toISOString(),
    progress: getProgress(),
  };
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ielts-紀錄-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** 匯入備份並和目前的紀錄合併：同一個字取比較晚作答的那筆。回傳匯入的字數 */
export async function importBackup(file: File): Promise<number> {
  let data: Partial<BackupFile>;
  try {
    data = JSON.parse(await file.text());
  } catch {
    throw new Error('檔案不是有效的 JSON');
  }
  if (data.app !== 'ielts-vocab' || !data.progress || typeof data.progress !== 'object') {
    throw new Error('這不是本網站匯出的紀錄檔');
  }
  const merged: ProgressMap = { ...getProgress() };
  let count = 0;
  for (const [id, raw] of Object.entries(data.progress)) {
    const s = migrate(raw as CardState);
    if (typeof s.l !== 'number' || typeof s.c !== 'number') continue;
    const cur = merged[id];
    if (!cur || s.l > cur.l || (s.l === cur.l && s.n > cur.n)) merged[id] = s;
    count++;
  }
  replaceProgress(merged);
  return count;
}

/** 請瀏覽器不要在空間不足時自動清掉這個網站的資料 */
export function requestPersistentStorage() {
  navigator.storage?.persist?.().catch(() => {});
}


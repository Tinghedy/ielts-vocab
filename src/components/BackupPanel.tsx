import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';
import { downloadBackup, importBackup } from '../storage/backup';
import { useProgress } from '../storage/progress';

export function BackupPanel() {
  const progress = useProgress();
  const input = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const count = Object.keys(progress).length;

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const n = await importBackup(file);
      setMsg({ ok: true, text: `已匯入 ${n} 個字的紀錄` });
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message });
    }
    if (input.current) input.current.value = '';
  };

  return (
    <section className="backup">
      <h2 className="section-title">學習紀錄</h2>
      <p className="muted small">
        紀錄存在這台裝置的這個瀏覽器裡（目前 {count} 個字）。換手機、換瀏覽器，或從檔案版換到網站版時，先匯出再到另一邊匯入。
      </p>
      <div className="backup-actions">
        <button className="btn" onClick={downloadBackup} disabled={count === 0}>
          <ArrowDownTrayIcon className="icon" aria-hidden />
          匯出紀錄
        </button>
        <button className="btn" onClick={() => input.current?.click()}>
          <ArrowUpTrayIcon className="icon" aria-hidden />
          匯入紀錄
        </button>
        <input
          ref={input}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </div>
      {msg && <p className={`small ${msg.ok ? 'ok' : 'error'}`}>{msg.text}</p>}
    </section>
  );
}

import { useCallback, useRef } from 'react';
import type { Accent } from '../types';

const AUDIO_BASE = 'https://raw.githubusercontent.com/designfuchen/word-atlas/main/public/atlas/audio';
const missing = new Set<string>(); // 抓不到音檔的字，下次直接改用 SpeechSynthesis

function speak(text: string, accent: Accent) {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = accent === 'uk' ? 'en-GB' : 'en-US';
  u.rate = 0.9;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

export function useAudio() {
  const current = useRef<HTMLAudioElement | null>(null);

  return useCallback((id: string, word: string, accent: Accent) => {
    current.current?.pause();
    const key = `${accent}/${id}`;
    if (missing.has(key)) return speak(word, accent);
    const audio = new Audio(`${AUDIO_BASE}/${key}.mp3`);
    current.current = audio;
    audio.play().catch(() => {
      missing.add(key);
      speak(word, accent);
    });
  }, []);
}

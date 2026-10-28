import { SpeakerWaveIcon } from '@heroicons/react/24/outline';
import type { MouseEvent } from 'react';
import { useAudio } from '../hooks/useAudio';
import { useSettings } from '../storage/settings';
import type { Word } from '../types';

export function AudioButton({ word }: { word: Word }) {
  const play = useAudio();
  const { accent } = useSettings();
  const onClick = (e: MouseEvent) => {
    e.stopPropagation(); // 不要觸發翻面
    play(word.id, word.word, accent);
  };
  return (
    <button
      className="audio-btn"
      onClick={onClick}
      onPointerDown={(e) => e.stopPropagation()}
      aria-label={`播放 ${word.word} 的發音`}
    >
      <SpeakerWaveIcon className="icon" aria-hidden />
    </button>
  );
}

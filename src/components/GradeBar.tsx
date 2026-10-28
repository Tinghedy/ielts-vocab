import { CheckIcon, EyeIcon, QuestionMarkCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Rating } from '../types';

export function GradeBar({ flipped, onFlip, onGrade }: { flipped: boolean; onFlip: () => void; onGrade: (r: Rating) => void }) {
  if (!flipped) {
    return (
      <div className="grade-bar">
        <button className="btn primary big full" onClick={onFlip}>
          <EyeIcon className="icon" aria-hidden />
          看答案
        </button>
      </div>
    );
  }
  return (
    <div className="grade-bar three">
      <button className="btn big grade again" onClick={() => onGrade('again')}>
        <XMarkIcon className="icon" aria-hidden />
        不認識<kbd>1</kbd>
      </button>
      <button className="btn big grade hard" onClick={() => onGrade('hard')}>
        <QuestionMarkCircleIcon className="icon" aria-hidden />
        模糊<kbd>2</kbd>
      </button>
      <button className="btn big grade good" onClick={() => onGrade('good')}>
        <CheckIcon className="icon" aria-hidden />
        記得<kbd>3</kbd>
      </button>
    </div>
  );
}

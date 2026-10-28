import { useRef, useState, type PointerEvent } from 'react';

export type SwipeDir = 'left' | 'right';

/** 水平滑動：拖曳時回傳位移，放開時超過門檻就呼叫 onSwipe。enabled=false 時只當作點擊 */
export function useSwipe(enabled: boolean, onSwipe: (dir: SwipeDir) => void, onTap: () => void) {
  const start = useRef<{ x: number; y: number; id: number } | null>(null);
  const [dx, setDx] = useState(0);
  const moved = useRef(false);

  const reset = () => {
    start.current = null;
    setDx(0);
  };

  return {
    dx,
    handlers: {
      onPointerDown(e: PointerEvent<HTMLElement>) {
        if (e.button !== 0) return;
        start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
        moved.current = false;
      },
      onPointerMove(e: PointerEvent<HTMLElement>) {
        const s = start.current;
        if (!s || s.id !== e.pointerId) return;
        const x = e.clientX - s.x;
        const y = e.clientY - s.y;
        if (!moved.current && Math.abs(x) > 8 && Math.abs(x) > Math.abs(y)) {
          moved.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
        }
        if (moved.current && enabled) setDx(x);
      },
      onPointerUp(e: PointerEvent<HTMLElement>) {
        const s = start.current;
        if (!s || s.id !== e.pointerId) return;
        const x = e.clientX - s.x;
        const threshold = Math.min(100, e.currentTarget.offsetWidth * 0.25);
        if (!moved.current) onTap();
        else if (enabled && Math.abs(x) > threshold) onSwipe(x > 0 ? 'right' : 'left');
        reset();
      },
      onPointerCancel: reset,
    },
  };
}

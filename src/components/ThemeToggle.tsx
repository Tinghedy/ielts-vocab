import { ComputerDesktopIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { updateSettings, useSettings, type Theme } from '../storage/settings';

const NEXT: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' };
const LABEL: Record<Theme, string> = { system: '跟隨系統', light: '淺色', dark: '深色' };
const ICON: Record<Theme, typeof SunIcon> = { system: ComputerDesktopIcon, light: SunIcon, dark: MoonIcon };

export function ThemeToggle() {
  const { theme } = useSettings();
  const Icon = ICON[theme];
  return (
    <button
      className="icon-btn"
      onClick={() => updateSettings({ theme: NEXT[theme] })}
      aria-label={`外觀：${LABEL[theme]}，點一下切換`}
      title={`外觀：${LABEL[theme]}`}
    >
      <Icon className="icon" aria-hidden />
    </button>
  );
}

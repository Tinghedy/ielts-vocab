// 用「本地日曆日」的整數表示日期，今天的範圍跟著使用者的時區走
const MS_PER_DAY = 86_400_000;

export function toDay(date: Date = new Date()): number {
  return Math.floor((date.getTime() - date.getTimezoneOffset() * 60_000) / MS_PER_DAY);
}

export function today(): number {
  return toDay(new Date());
}

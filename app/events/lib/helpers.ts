// app/events/lib/helpers.ts
export function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
    [1, "second"],
  ];
  for (const [unitSec, label] of intervals) {
    const count = Math.floor(seconds / unitSec);
    if (count >= 1) return `${count} ${label}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export function daysRemaining(target: Date) {
  return Math.ceil((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export function friendlyStatus(target: Date) {
  const days = daysRemaining(target);
  if (days < 0) return { label: "Event passed", variant: "gray" };
  if (days === 0) return { label: "Happening today", variant: "red" };
  if (days <= 3) return { label: "Happening soon", variant: "orange" };
  if (days > 50) return { label: "50+ days away", variant: "blue" };
  return { label: `${days} day${days !== 1 ? "s" : ""} remaining`, variant: "green" };
}

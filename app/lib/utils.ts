import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function formatSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (!Number.isFinite(bytes) || Number.isNaN(bytes)) return "0 B";

  const sign = bytes < 0 ? -1 : 1;
  const abs = Math.abs(bytes);
  const unit = 1024;
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.min(
    Math.floor(Math.log(abs) / Math.log(unit)),
    units.length - 1
  );

  const value = (abs / Math.pow(unit, i)) * sign;

  // Show 0 decimals for values >= 10, 1 decimal for values < 10
  const decimals = Math.abs(value) >= 10 || i === 0 ? 0 : 1;

  return `${value.toFixed(decimals)} ${units[i]}`;
}

export function generateUUID() {
  return crypto.randomUUID();
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function bigIntReplacer(key: string, value: unknown) {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
}

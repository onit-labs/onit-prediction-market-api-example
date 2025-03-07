import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import SuperJSON from "superjson";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function bigIntReplacer(key: string, value: unknown) {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
}

/**
 * Preprocesses data to be parsed by SuperJSON
 * @param data - The data to preprocess
 * @returns The preprocessed data
 */
export function preprocessSuperJSON(data: unknown) {
  if (typeof data === "string") return SuperJSON.parse(data);

  if (data && typeof data === "object" && "json" in data && "meta" in data)
    return SuperJSON.parse(JSON.stringify(data));

  return data;
}
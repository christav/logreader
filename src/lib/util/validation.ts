import { basename } from "path";

// Make sure the string itself is only a filename, no /, \\, or ..
export function pathIsFilename(fn: string): boolean {
  return basename(fn) === fn;
}

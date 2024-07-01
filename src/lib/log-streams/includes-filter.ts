import { Transform } from "stream";

export function makeIncludeFilter(includes: string) {
  return Transform.from(
    async function *(source: AsyncIterable<string>, { signal }: { signal: AbortSignal }) {
    for await (let line of source) {
      if (signal && signal.aborted) {
        return;
      }
      if (line.indexOf(includes) !== -1) {
        yield line;
      }
    }
  });
}

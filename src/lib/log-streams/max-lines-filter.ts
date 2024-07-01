import { Transform } from 'stream';

export function makeMaxLinesFilter(n: number, abortController?: AbortController) {
  return Transform.from(
    async function *(source: AsyncIterable<string>, {signal}: {signal: AbortSignal}) {
      let linesLeft = n;
      for await (let line of source) {
        if (signal && signal.aborted) {
          return;
        }
        yield line;
        if (linesLeft !== -1) {
          --linesLeft;
        }
        if (linesLeft === 0) {
          if (abortController) {
            abortController.abort();
          }
          return;
        }
      }
    }
  );
}

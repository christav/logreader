import { Transform } from 'stream';

export function makeToLinesTransform() {
  return new Transform({
    transform(chunk, encoding, callback) {
      const line = (chunk.toString('utf8') as string).trimEnd();
      this.push(line, 'utf8');
      callback();
    },
  });
}
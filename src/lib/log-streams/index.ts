import { Readable } from "stream";

export function makeReverseBlockStream(logfile: string): Readable {
  return new Readable({
    read (size) {
      this.push(null);
    }
  });
}

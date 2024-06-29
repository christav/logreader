import { Transform, TransformCallback, TransformOptions } from 'stream';

class ToLinesTransform extends Transform {
  private pendingChunk: Buffer;
  private firstChunk: boolean;

  constructor(options: TransformOptions) {
    super(options);

    this.pendingChunk = Buffer.allocUnsafe(0);
    this.firstChunk = true;
  }

  _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
    // Prepend this chunk to pending chunk
    // Isolate out first line from chunk
    // Store first line as new pending chunk

    // Convert rest of chunk of text
    // split on line ends
    // if firstChunk:
    //    if chunk[-1] != \n:
    //      skip last line (it's incomplete)
    //    firstChunk = false
    // for each line in chunk.reversed():
    //   output(line)
    // done
  }

  _flush(callback: TransformCallback): void {
    // Convert pending chunk to text - will be one line
    // output it
    // done
  }
}

export function makeToLinesTransform() {
  return new Transform({
    transform(chunk, encoding, callback) {
      const line = (chunk.toString('utf8') as string).trimEnd();
      this.push(line, 'utf8');
      callback();
    },
  });
}
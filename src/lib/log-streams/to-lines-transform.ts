import { Transform, TransformCallback, TransformOptions } from 'stream';

class ToLinesTransform extends Transform {
  private pendingChunk: Buffer;

  constructor(options: TransformOptions = {}) {
    super({...options, encoding: 'utf8', readableObjectMode: true});

    this.pendingChunk = Buffer.allocUnsafe(0);
  }

  _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
    // Prepend this chunk to pending chunk
    // Since this chunk is "older" since we're getting them backwards from the source
    const fullChunk = Buffer.concat([chunk as Buffer, this.pendingChunk]);

    // Isolate out first line from chunk - could be incomplete, so we save
    // the first line until we get the next chunk or the stream ends
    // 0x0a is the code for lf, which is always at the end even if using windows
    // crlf separators.
    const firstLineEndIndex = fullChunk.indexOf(0x0a);
    if (firstLineEndIndex === -1) {
      // The entire chunk is an incomplete line. We can just
      // throw it out; the only condition this could happen
      // is at the start of the stream, i.e. the end of the file.
      callback();
      return;
    }

    // Isolate first line in the chunk. This may be incomplete (with more
    // data in the following chunk) so we need to save it for later.
    const firstLineChunk = fullChunk.subarray(0, firstLineEndIndex+1);
    this.pendingChunk = firstLineChunk;

    // Pull out the remains of the chunk and output the lines
    const logsString = fullChunk.subarray(firstLineEndIndex+1).toString('utf8');
    let logLines = logsString.split(/\r?\n/);

    // Output each line from the transform, skipping the last element.
    // We skip the last element for two reasons.
    //  1. In the normal case, the block ended with a line separator, so
    //     string.split leaves us with an extraneous blank line at the
    //     end of the array.
    //  2. In the case of the first chunk coming into the transform,
    //     if the logfile is being written to while we're reading out,
    //     the last element will not be a complete line, and we've chosen
    //     to skip that since it could be garbage.
    for (let line of logLines.slice(0, -1)) {
      this.push(line, 'utf8');
    }

    // and we're done with the chunk
    callback();
  }

  _flush(callback: TransformCallback): void {
    // Convert pending chunk to text - will be one line
    // Strip off the last character(s) since they're the line separator
    const oldestLogLine = this.pendingChunk.toString('utf8').trimEnd();
    this.push(oldestLogLine, 'utf8');
    callback();
  }
}

export function makeToLinesTransform() {
  return new ToLinesTransform();
}

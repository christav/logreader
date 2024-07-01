import { Transform, TransformCallback, TransformOptions } from 'stream';

class TextPlainFormatterStream extends Transform {
  constructor(options: TransformOptions = {}) {
    super({...options, readableObjectMode: true, writableObjectMode: false });
  }

  _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
    const line = chunk as string;
    this.push(Buffer.from(line + '\n', 'utf8'));
    callback();
  }
}

export function makeTextPlainFormatter(): Transform {
  return new TextPlainFormatterStream();
}

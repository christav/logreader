import { Transform, TransformCallback, TransformOptions } from 'stream';

class TextHtmlFormatterStream extends Transform {
  constructor(options: TransformOptions = {}) {
    super({...options, readableObjectMode: true, writableObjectMode: false });
  }

  _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
    const line = chunk as string;
    this.push(Buffer.from(`<li>${line}</li>`, 'utf8'));
    callback();
  }
}

export function makeTextHtmlFormatter(): Transform {
  return new TextHtmlFormatterStream();
}

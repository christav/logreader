import { Transform, TransformCallback, TransformOptions } from 'stream';

class JsonFormatterStream extends Transform {
  private firstItem = true;

  constructor(options: TransformOptions = {}) {
    super({...options, readableObjectMode: true, writableObjectMode: false });
  }

  _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
    let prefix = '';

    if (this.firstItem) {
      prefix = '[';
      this.firstItem = false;
    } else {
      prefix = ','
    }

    const line = chunk as string;
    this.push(Buffer.from(`${prefix}"${line}"`, 'utf8'));
    callback();
  }

  _flush(callback: TransformCallback): void {
    this.push(Buffer.from(']'));
    callback();
  }
}

export function makeJsonFormatter(): Transform {
  return new JsonFormatterStream();
}

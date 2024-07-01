import { expect } from 'chai';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

import {
  makeReverseBlockStream,
  makeToLinesTransform,
  makeTextPlainFormatter,
} from '../../src/lib/log-streams';

import { sampleFilePath } from '../test-support';

describe('reverse block plus tolines transform', () => {
  it ('should return last line first and first line last', async () => {
    const file = sampleFilePath('log0.log');

    const lines: string[] = [];

    await pipeline(
      await makeReverseBlockStream(file),
      makeToLinesTransform(),
      async function *(source) {
        for await (let line of source) {
          lines.push(line);
        }
      }
    );

    expect(lines[0]).to.eql('140.15.84.188 - roob6486 [01/Jul/2024:00:02:21 +0000] "PUT /seamless/impactful HTTP/1.1" 204 7657');
    expect(lines[lines.length-1])
      .to.eql('130.113.178.170 - thiel5604 [01/Jul/2024:00:02:21 +0000] "PUT /enterprise/schemas/rich/e-business HTTP/1.1" 502 29692');
  });
});

describe('text plain formatter', () => {
  it('should separate output lines with \\n only', async () => {
    const lines = [ 'line1', 'line2', 'line3' ];
    let outputChunk: Buffer = Buffer.alloc(0);

    await new Promise((resolve, reject) => {
      const source = Readable.from(lines);
      const formattedStream = source.pipe(makeTextPlainFormatter());

      formattedStream.on('readable', function (this: Readable) {
        let data: Buffer;
        while (data = this.read()) {
          outputChunk = Buffer.concat([outputChunk, data]);
        }
      });

      formattedStream.on('end', () => {
        resolve(null);
      });

      source.resume();
    });

    expect(outputChunk.toString('utf8')).to.eql(
      'line1\nline2\nline3\n'
    );
  });
})
import { expect } from 'chai';
import { pipeline } from 'stream/promises';

import { makeReverseBlockStream, makeToLinesTransform } from '../../src/lib/log-streams';

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
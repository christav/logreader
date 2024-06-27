import { expect } from 'chai';
import { sampleFilePath } from '../test-support';

import { makeReverseBlockStream } from '../../src/lib/log-streams';

import { finished } from 'stream/promises';

describe('ReverseBlockStream', () => {
  it('should immediately exit without emitting if handed an empty file', async () => {
    const emptyFilePath = sampleFilePath('empty-log.log');
    const revStream = makeReverseBlockStream(emptyFilePath);

    let numBlocks = 0;
    revStream.on('readable', () => { ++numBlocks; });
    revStream.resume();
    await finished(revStream);

    expect(numBlocks).to.eql(0);
  });
});

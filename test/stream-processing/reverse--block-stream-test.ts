import { expect } from 'chai';
import { sampleFilePath } from '../test-support';

import { makeReverseBlockStream } from '../../src/lib/log-streams';

import { finished } from 'stream/promises';
import { Readable } from 'stream';

describe('ReverseBlockStream', () => {
  it('should immediately exit without emitting if handed an empty file', async () => {
    const emptyFilePath = sampleFilePath('empty-log.log');
    const revStream = makeReverseBlockStream(emptyFilePath);

    let numBlocks = 0;
    revStream.on('readable', function (this: Readable) {
      while(this.read() !== null) {
        ++numBlocks;
      }
    });
    revStream.resume();
    await finished(revStream);

    expect(numBlocks).to.eql(0);
  });

  it('should return one block if file is one block long');
  it('should return blocks in reverse order if there are multiple blocks in log');
  it('should return partial first block last if log is not multiple of block size');
  it('should not interfere with writing to file while open');
  it('should skip new logs written while returning blocks');
});

import { expect } from 'chai';
import { sampleFilePath } from '../test-support';

import { makeReverseBlockStream } from '../../src/lib/log-streams';

describe('ReverseBlockStream', () => {
  it('should immediately exit without emitting if handed an empty file', async () => {
    const emptyFilePath = sampleFilePath('empty-log.log');
    const revStream = await makeReverseBlockStream(emptyFilePath);

    let numBlocks = 0;
    for await (let block of revStream) {
      ++numBlocks;
    }

    expect(numBlocks).to.eql(0);
  });

  it('should return one block if file is one block long', async () => {
    const testFilePath = sampleFilePath('one-line-16-bytes.log');
    const revStream = await makeReverseBlockStream(testFilePath, 16);

    let numBlocks = 0;
    let blocks: Buffer[] = [];

    for await (let block of revStream) {
      blocks.push(block);
      ++numBlocks;
    }

    expect(numBlocks).to.eql(1);
    const blockText = blocks[0].toString('utf8')
    expect(blockText).to.eql('0123456789abcdef');
  });

  it('should return blocks in reverse order if there are multiple blocks in log', async () => {
    const testFilePath = sampleFilePath('one-line-20-bytes.log');
    const revStream = await makeReverseBlockStream(testFilePath, 10);

    let blocks: Buffer[] = [];
    for await (let block of revStream) {
      blocks.push(block);
    }

    expect(blocks).to.have.lengthOf(2);
    expect(blocks[0].toString('utf8')).to.eql('abcdefghij');
    expect(blocks[1].toString('utf8')).to.eql('0123456789');
  });

  it('should return partial first block last if log is not multiple of block size', async () => {
    const testFilePath = sampleFilePath('one-line-20-bytes.log');
    const revStream = await makeReverseBlockStream(testFilePath, 7);

    let blocks: Buffer[] = [];
    for await (let block of revStream) {
      blocks.push(block);
    }

    expect(blocks).to.have.lengthOf(3);
    expect(blocks[0].toString('utf8')).to.eql('defghij');
    expect(blocks[1].toString('utf8')).to.eql('6789abc');
    expect(blocks[2].toString('utf8')).to.eql('012345');
  });

  it('should not interfere with writing to file while open');
  it('should skip new logs written while returning blocks');
});

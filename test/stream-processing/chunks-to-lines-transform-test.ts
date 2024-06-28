import { expect } from 'chai';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { makeToLinesTransform } from '../../src/lib/log-streams';

describe('line transform transform', () => {
  it('should return one line from one line stream', async () => {
    const chunks = [Buffer.from('this is a line\n', 'utf8')];
    const lines: string[] = [];
    
    await pipeline(
      chunks,
      makeToLinesTransform(),
      async function *(source) {
        (source as Readable).setEncoding('utf8');
        for await (let line of source) {
          lines.push(line);
        }
      }
    );

    expect(lines).to.have.lengthOf(1);
    expect(lines[0]).to.eql('this is a line');
  });


});

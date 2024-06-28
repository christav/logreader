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

  it('should return lines in reverse order from chunk', async () => {
    const chunks = [
      Buffer.from('This is the old line\nThis is the new line\n')
    ];
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

    expect(lines).to.have.lengthOf(2);
    expect(lines[0]).to.eql('this is the new line');
    expect(lines[1]).to.eql('This is the old line');
  });

  it('should return all lines split across chunks');
  it('should not return partial line at start of first chunk');
  it('should delimit lines by crlf');
  it('should not output oldest line in chunk if invalid utf8');
});

import { expect } from 'chai';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { makeToLinesTransform } from '../../src/lib/log-streams';

async function runTransform(chunks: Buffer[]): Promise<string[]> {
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

  return lines;
}

describe('line transform transform', () => {
  it('should return one line from one line stream', async () => {
    const chunks = [Buffer.from('this is a line\n', 'utf8')];

    const lines = await runTransform(chunks);

    expect(lines).to.have.lengthOf(1);
    expect(lines[0]).to.eql('this is a line');
  });

  it('should return lines in reverse order from chunk', async () => {
    const chunks = [
      Buffer.from('This is the old line\nThis is the new line\n')
    ];

    const lines = await runTransform(chunks);

    expect(lines).to.have.lengthOf(2);
    expect(lines[0]).to.eql('This is the new line');
    expect(lines[1]).to.eql('This is the old line');
  });

  it('should return all lines split across chunks', async () => {
    const chunks = [
      Buffer.from(' almost newest line\nAnd the really newest line\n'),
      Buffer.from('second line\nThis is the'),
      Buffer.from('This is the oldest line\nThis is the '),
    ];

    const lines = await runTransform(chunks);

    expect(lines).to.eql([
      'And the really newest line',
      'This is the almost newest line',
      'This is the second line',
      'This is the oldest line'
    ]);
  });

  it('should not return partial line at end of first chunk', async () => {
    const chunks = [
      Buffer.from('First complete line\nand a partial'),
      Buffer.from('Start of file\n')
    ];

    const lines = await runTransform(chunks);

    expect(lines).to.eql(['First complete line', 'Start of file']);
  });

  it('should delimit lines by crlf', async () => {
    const chunks = [
      Buffer.from(' newest line\r\n'),
      Buffer.from('second line\r\nThis is the'),
      Buffer.from('This is the oldest line\r\nThis is the '),
    ];

    const lines = await runTransform(chunks);

    expect(lines).to.have.lengthOf(3);
    expect(lines).to.eql([
      'This is the newest line',
      'This is the second line',
      'This is the oldest line'
    ]);

  });
});

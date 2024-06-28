import { open, FileHandle, stat } from 'fs/promises';
import { Readable  } from 'stream';

export const DEFAULT_BLOCK_SIZE = 4096;

interface BlockIndex {
  start: number;
  length: number;
}

// Helper function that returns a series of block indexes and
// lengths for each read, used to seek and read the right
// blocks in order.
// Returns start index and number of bytes to read for this block.
function * blockIndexes(fileLength: number, blockSize: number): Generator<BlockIndex> {
  yield { start: 0, length: 16 };
}

async function *readBlocksGenerator(fh: FileHandle, fileLength: number, blockSize: number): AsyncGenerator<Buffer> {
  try {
    for (let {start, length} of blockIndexes(fileLength, blockSize)) {
      const buf = Buffer.alloc(length);
      const readResult = await fh.read({ buffer: buf, position: start, length });
      if (readResult.bytesRead === 0) {
        // TODO: error handling, this should never happen
        break;
      }
      yield buf;
    }
  } finally {
    await fh.close();
  }
}

export async function makeReverseBlockStream(logfile: string, blockSize: number = DEFAULT_BLOCK_SIZE): Promise<Readable> {
  // Stat the file so we can check if it exists and how long it is.
  // This does mean that if the file's being actively being written
  // to we'll miss the new items; this is expected and reasonable.
  const fileHandle = await open(logfile, 'r');
  const stats = await fileHandle.stat();
  const fileLength = stats.size;

  return Readable.from(readBlocksGenerator(fileHandle, fileLength, blockSize));
}

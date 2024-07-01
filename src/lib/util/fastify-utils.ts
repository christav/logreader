import { FastifyReply } from "fastify";
import { basename } from "path";
import { Readable } from 'stream';

// Make sure the string itself is only a filename, no /, \\, or ..
export function pathIsFilename(fn: string): boolean {
  return basename(fn) === fn;
}

export function streamToReply(reply: FastifyReply): (source: any) => AsyncGenerator<never, void, undefined> {
  return async function *(source) {
    const final = Readable.from(source);
    await reply.send(final);
  };
}

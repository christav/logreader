import { FastifyRequest, FastifyReply } from "fastify";
import { Transform } from 'stream';
import {
  makeJsonFormatter,
  makeTextHtmlFormatter,
  makeTextPlainFormatter
} from "../log-streams";

interface FormatterMap {
  [mimeType: string]: [() => Transform, string];
}

const makeFormatterMap: FormatterMap = {
  'TEXT/*': [makeTextPlainFormatter, 'text/plain'],
  'TEXT/PLAIN': [makeTextPlainFormatter, 'text/plain'],
  'TEXT/HTML': [makeTextHtmlFormatter, 'text/html'],
  'APPLICATION/JSON': [makeJsonFormatter, 'application/json'],
  '': [makeJsonFormatter, 'application/json']
};

export function makeFormatter(req: FastifyRequest): { contentType: string, formatter: Transform } {
  const requestedFormat = ((req.headers['accept'] as string) || '').toUpperCase();
  const entry: [Function, string] | undefined = makeFormatterMap[requestedFormat];
  if (!entry) {
    return { contentType: 'application/json', formatter: makeJsonFormatter() };
  }

  const [maker, mimeType] = entry;
  return { contentType: mimeType, formatter: maker() };
}

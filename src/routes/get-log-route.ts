import { RouteOptions } from 'fastify';
import { join as pathJoin } from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

import {
  config,
  pathIsFilename,
  makeFormatter,
  streamToReply
 }  from '../lib/util';

import {
  makeReverseBlockStream,
  makeToLinesTransform,
  makeIncludeFilter,
  makeMaxLinesFilter
} from '../lib/log-streams';

export const getLogRoute: RouteOptions = {
  method: 'GET',
  url: '/logs',
  schema: {
    querystring: {
      log: { type: 'string' },
      inc: { type: 'string' },
      n: { type: 'integer', minimum: 1 }
    }
  },

  async handler (req, resp) {
    req.log.debug({title: "query string", qs: req.query});
    // Validate file name isn't trying to escape the log dir
    const fn: string = (req.query as any)['log'];

    // If it's anything other than a base path, they're trying to break
    // out of our log directory, just bail. No details on file not found,
    // no reason to make hackers life easier.
    if (!pathIsFilename(fn)) {
      resp.statusCode = 400;
      return;
    }

    const logFilePath = pathJoin(config.logFilesDir, fn);

    // Create formatter based on Accept header
    const { contentType, formatter } = makeFormatter(req);

    // Build output pipeline based on query params
    const includeTerm = (req.query as any)['inc'] || '';
    const filter = makeIncludeFilter(includeTerm);

    const maxLines = Number.parseInt((req.query as any)['n'] || '-1', 10);
    const maxLinesFilter = makeMaxLinesFilter(maxLines);

    // Process pipeline and output

    try {
      resp.type(contentType);
      const source = await makeReverseBlockStream(logFilePath);
      const lines = makeToLinesTransform();
      await pipeline(
        source,
        lines,
        filter,
        maxLinesFilter,
        formatter,
        streamToReply(resp)
      );
    } catch (err: any) {
      // Catch file not found error, return 400
      if (err.code && err.code === 'ENOENT') {
        resp.statusCode = 400;
        return;
      }
      // Any other error, let fastify turn it into a 500
      throw err;
    }
  }
}

import { RouteOptions } from 'fastify';
import { join as pathJoin } from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

import { config, pathIsFilename, makeFormatter }  from '../lib/util';

import {
  makeReverseBlockStream,
  makeToLinesTransform,
  makeIncludeFilter,
} from '../lib/log-streams';

export const getLogRoute: RouteOptions = {
  method: 'GET',
  url: '/logs',
  schema: {
    querystring: {
      log: { type: 'string' }
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

    // Process pipeline and output

    resp.type(contentType);
    const source = await makeReverseBlockStream(logFilePath);
    const lines = makeToLinesTransform();
    const filter = makeIncludeFilter(includeTerm);
    await pipeline(
      source,
      lines,
      filter,
      formatter,
      async function *(source) {
        const final = Readable.from(source);
        await resp.send(final);
      }
    )
  }
}

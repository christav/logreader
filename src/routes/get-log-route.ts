import { RouteOptions } from 'fastify';
import { join as pathJoin } from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

import config from '../lib/util/config';
import { pathIsFilename } from '../lib/util/validation';

import { makeReverseBlockStream, makeToLinesTransform } from '../lib/log-streams';

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
    if (!pathIsFilename(fn)) {
      resp.statusCode = 400;
      return;
    }

    const logFilePath = pathJoin(config.logFilesDir, fn);

    // Build output pipeline based on query params
    // Process pipeline and output

    resp.type('text/plain');
    const source = await makeReverseBlockStream(logFilePath);
    const lines = makeToLinesTransform();
    await pipeline(
      source,
      lines,
      async function *(source) {
        for await (let line of source) {
          yield line + '\n';
        }
      },
      async function *(source) {
        const final = Readable.from(source);
        await resp.send(final);
      }
    )
  }
}

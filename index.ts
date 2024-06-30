import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';
import Fastify from 'fastify';

const server = Fastify({ logger: true });

server.get('/logs', async function (req, reply) {
  reply.type('application/json');
  const sourceFile = `${__dirname}/../package.json`;
  console.log(`Sending file ${sourceFile}`);
  const source = createReadStream(sourceFile);
  return reply.send(source);
});

async function run() {
  await server.listen(
    { port: 3001 },
    function (err, address) {
      if (err) {
        console.log(`Startup failed, error ${err}`);
      } else {
        console.log(`Server started at ${address}`);
      }
    }
  )
}

run()
  .then(
    () => console.log('Server exitting'),
    (err) => console.log(`Server exitted with error ${err}`)
  );

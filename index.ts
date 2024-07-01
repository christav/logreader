import Fastify from 'fastify';
import { getLogRoute } from './src/routes/get-log-route';

const server = Fastify({ logger: { level: 'debug'} });

server.route(getLogRoute);

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
    () => console.log('Server started'),
    (err) => console.log(`Server startup failed with error ${err}`)
  );

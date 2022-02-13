/* eslint-disable no-console */
import server from './koa';

const port = process.env.PORT || 6543;

server.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}!`);
  if (process.env.NODE_ENV === 'development')
    console.info(`You can open API on this URI: http://localhost:${port}/api/v1`);
});
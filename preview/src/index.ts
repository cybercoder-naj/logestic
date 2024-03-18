import { Elysia } from 'elysia';
import { Logestic } from 'logestic';

const logger = new Logestic()
  .use('ip')
  .use('method')
  .use('path')
  .use('status')
  .use('time')
  .custom(({ ip, method, path, status, time }) => {
    return `${ip} ${method} ${path} ${status} ${time}`;
  });

const app = new Elysia()
  .use(logger)
  .get('/', () => 'Hello, world!')
  .listen(3000, () => {
    console.log('Server is running on port 3000');
  });

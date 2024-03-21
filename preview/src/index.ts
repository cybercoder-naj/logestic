import { Elysia } from 'elysia';
import { Logestic } from 'logestic';

const app = new Elysia()
  .use(Logestic.preset('common', { showType: true }))
  .get('/', () => 'Hello, world!')
  .get('/hello/:name', ({ params: { name } }) => `Hello, ${name}!`)
  .get('/returnBad', ({ set }) => {
    set.status = 402;
    return 'Bad';
  })
  .get('/crashServer', ({ set }) => {
    set.status = 500;
    return 'Server crashed';
  })
  .listen(3000, () => {
    console.log('Server is running on port 3000');
  });

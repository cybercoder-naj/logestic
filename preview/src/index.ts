import { Elysia } from 'elysia';
import { Logestic } from 'logestic';

const app = new Elysia()
  .use(Logestic.preset('fancy'))
  .get('/', () => 'Hello, world!')
  .get('/hello/:name', ({ params: { name } }) => `Hello, ${name}!`)
  .get('/returnBad', ({ set, logestic }) => {
    set.status = 402;
    logestic.debug("Something isn't quite right");
    return 'Bad';
  })
  .get('/crashServer', ({ set, logestic }) => {
    set.status = 500;
    logestic.error('MAYDAY!');
    return 'Server crashed';
  })
  .listen(3000, () => {
    console.log('Server is running on port 3000');
  });

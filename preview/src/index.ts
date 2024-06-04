import { Elysia } from 'elysia';
import { Logestic } from 'logestic';

const logger = new Logestic().use(['method', 'status']).format({
  onSuccess({ method, status }) {
    return `${method} ${status}`;
  },
  onFailure({ request, code }) {
    return `${request.method} ${code}`;
  }
});

const app = new Elysia()
  .use(logger)
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

export default app;

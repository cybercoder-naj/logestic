import { describe, it, expect, beforeAll, beforeEach } from 'bun:test';
import { Elysia } from 'elysia';
import { Logestic } from '../src';
import { edenTreaty } from '@elysiajs/eden';

describe('Logestic', () => {
  describe('Custom formatting', () => {
    let app: Elysia;
    let client: any;
    let logs: string[] = [];

    beforeAll(() => {
      const logestic = new Logestic(msg => logs.push(msg))
        .use('method')
        .use('path')
        .use('contentLength');

      const logger = logestic.custom(({ method, path, contentLength }) => {
        return `${method} ${path} ${contentLength}`;
      });

      app = new Elysia()
        .use(logger)
        .get('/api/:id', () => 'Hello, World!')
        .listen(3000);

      client = edenTreaty<typeof app>('http://127.0.0.1:3000');
    });

    beforeEach(() => (logs = []));

    it('Custom formatting', async () => {
      await client.api['hi'].get();

      console.log('Custom logs', logs);
      expect(logs.length).toBe(1);
      expect(logs[0]).toBe('GET /api/hi 0');
    });
  });

  describe('Preset formatting', () => {
    let app: Elysia;
    let client: any;
    let logs: string[] = [];

    beforeAll(() => {
      const logger = Logestic.preset('common', msg => logs.push(msg));

      app = new Elysia()
        .use(logger)
        .get('/api/:id', () => 'Hello, World!')
        .listen(3000);

      client = edenTreaty<typeof app>('http://127.0.0.1:3000');
    });

    beforeEach(() => (logs = []));

    it('Preset formatting', async () => {
      await client.api['hi'].get();

      expect(logs.length).toBe(1);
      expect(logs[0]).toBe('<ip?> GET /api/hi 200 0');
    });
  });
});

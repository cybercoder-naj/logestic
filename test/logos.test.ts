import { describe, it, expect, beforeAll, beforeEach } from 'bun:test';
import { Elysia, t } from 'elysia';
import { Logos } from '../src';
import { edenTreaty } from '@elysiajs/eden';

describe('Logos', () => {
  describe('Custom formatting', () => {
    let app: Elysia;
    let client: any;
    let logs: string[] = [];

    beforeAll(() => {
      const logos = new Logos(msg => logs.push(msg))
        .use('method')
        .use('path')
        .use('contentLength');

      const logger = logos.custom(({ method, path, contentLength }) => {
        return `${method} ${path} ${contentLength}`;
      });

      app = new Elysia()
        .use(logger)
        .get('/api/:id', () => 'Hello, World!')
        .listen(3000);

      client = edenTreaty<typeof app>('http://localhost:3000');
    });

    beforeEach(() => (logs = []));

    it('Make a log on a request by default', async () => {
      const { data } = await client.api['hi'].get({
        $query: {
          id: 1
        }
      });
      expect(logs.length).toBe(1);
      expect(logs[0]).toBe('GET /api/hi 0');
    });
  });

  describe('Preset formatting', () => {
    let app: Elysia;
    let client: any;
    let logs: string[] = [];

    beforeAll(() => {
      const logger = Logos.preset('common');

      app = new Elysia()
        .use(logger)
        .get('/api/:id', () => 'Hello, World!')
        .listen(3000);

      client = edenTreaty<typeof app>('http://localhost:3000');
    });

    beforeEach(() => (logs = []));

    it('Make a log on a request by default', async () => {
      const { data } = await client.api['hi'].get({
        $query: {
          id: 1
        }
      });
      expect(logs.length).toBe(1);
      expect(logs[0]).toBe('GET /api/hi 0');
    });
  });
});

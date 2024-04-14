import { describe, test, expect, beforeAll } from 'bun:test';
// import { unlink } from 'node:fs/promises';
import { Logestic } from '../..';
import Elysia from 'elysia';
import { edenTreaty } from '@elysiajs/eden';

const tempFilePath = 'test.log';
const BASE_URL = 'http://127.0.0.1';
const PORT = 3000;

describe('Testing common preset', () => {
  let client = edenTreaty<typeof app>(`${BASE_URL}:${PORT}`);
  let tempFile = Bun.file(tempFilePath);
  let app = new Elysia()
    .use(
      Logestic.preset('common', {
        dest: tempFile
      })
    )
    .get('/', () => {
      return 'Hello, world!';
    });

  beforeAll(async () => {
    app.listen(PORT);
    await Bun.write(tempFile, '');
  });

  // afterAll(async () => {
  //   await unlink(tempFilePath);
  // });

  test('should log request and response', async () => {
    const { error } = await client.index.get();
    expect(error).toBeFalsy();

    const log = await tempFile.text();
    expect(log).toMatch(
      /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] GET \/ 200/
    );
  });
});

import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  beforeEach
} from 'bun:test';
import { unlink } from 'node:fs/promises';
import { writeFileSync } from 'node:fs';
import { Logestic } from '../..';
import Elysia from 'elysia';
import { edenTreaty } from '@elysiajs/eden';

const tempFilePath = 'test.log';
const tempFile = Bun.file(tempFilePath);
const BASE_URL = 'http://127.0.0.1';
const PORT = 3000;

beforeAll(() => {
  writeFileSync(tempFilePath, ' \n');
});

afterAll(async () => {
  await unlink(tempFilePath);
});

describe('Testing common preset', () => {
  let client = edenTreaty<typeof app>(`${BASE_URL}:${PORT}`);
  let app = new Elysia()
    .use(
      Logestic.preset('common', {
        dest: tempFile
      })
    )
    .get('/', () => {
      return 'Hello, world!';
    })
    .get('/error', ({ set }) => {
      set.status = 400;
    })
    .listen(PORT);

  beforeEach(() => {
    writeFileSync(tempFilePath, ' \n');
  });

  test('should log request and response', async () => {
    const { error } = await client.index.get();
    expect(error).toBeFalsy();

    const log = await tempFile.text();
    expect(log).toMatch(
      /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] GET \/ 200/
    );
  });

  test('multiple logs', async () => {
    const { error } = await client.index.get();
    expect(error).toBeFalsy();

    const { error: error2 } = await client.index.get();
    expect(error2).toBeFalsy();

    const log = await tempFile.text();
    expect(log).toMatch(
      /(\s*\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] GET \/ 200\s*){2}/
    );
  });

  test('log error', async () => {
    const { error } = await client.error.get();
    expect(error).toBeTruthy();

    const log = await tempFile.text();
    expect(log).toMatch(
      /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] GET \/error 400/
    );
  });
});

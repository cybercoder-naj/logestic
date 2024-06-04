import { describe, expect, test } from 'bun:test';
import preview from '../preview/src';
import { edenTreaty } from '@elysiajs/eden';

describe('Logestic', () => {
  const client = edenTreaty<typeof preview>('http://127.0.0.1:3000');
});

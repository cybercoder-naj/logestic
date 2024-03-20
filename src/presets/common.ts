import Elysia from 'elysia';
import { Logestic } from '..';
import chalk from 'chalk';
import { Type } from '@sinclair/typebox';

const common: Elysia = new Logestic(
  Bun.stdout,
  Type.Object({
    time: Type.String(),
    method: Type.String(),
    path: Type.String(),
    status: Type.Number()
  })
)
  .use('time')
  .use('method')
  .use('path')
  .format(({ attrs: { time, method, path } }) => {
    return '';
  });

export default common;

// const grayTime = chalk.gray(`[${time!!.toISOString()}]`);
// const methodPath = chalk.cyan(`${method} ${path}`);
// let statusColor = chalk.white;

// if (200 <= status && status < 300) statusColor = chalk.green;
// if (400 <= status && status < 500) statusColor = chalk.yellow;
// if (500 <= status) statusColor = chalk.red;

// return `[${grayTime}] ${methodPath} ${statusColor(status)}`;

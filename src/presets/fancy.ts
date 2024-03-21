import { Elysia } from 'elysia';
import { Logestic } from '..';
import chalk from 'chalk';
import { LogesticOptions } from '../types';

const getDateTimeString = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

export default (options: LogesticOptions): Elysia =>
  new Logestic({
    ...options,
    showType: true
  })
    .use(['time', 'method', 'path'])
    .format({
      onSuccess({ time, method, path }) {
        const dateTime = chalk.gray(getDateTimeString(time!!));
        const methodPath = chalk.cyan(`${method} ${path}`);

        return `${dateTime} ${methodPath}`;
      },
      onFailure({ request, datetime }) {
        const dateTime = getDateTimeString(datetime!!);
        return chalk.red(`${dateTime} ${request.method} ${request.url}`);
      }
    });

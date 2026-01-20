import { Logestic } from '..';
import chalk from 'chalk';
import type { LogesticOptions } from '../types';

const getDateTimeString = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const defaultOptions: LogesticOptions = {
  showLevel: true
};

export default (options: LogesticOptions) =>
  new Logestic({
    ...defaultOptions,
    ...options
  })
    .use(['time', 'method', 'path', 'duration'])
    .format({
      onSuccess({ time, method, path, duration }) {
        const dateTime = chalk.gray(getDateTimeString(time!!));
        const methodPath = chalk.cyan(`${method} ${path}`);

        return `${dateTime} ${methodPath} ${duration}μs`;
      },
      onFailure({ request, datetime }) {
        const dateTime = getDateTimeString(datetime!!);
        return chalk.red(`${dateTime} ${request.method} ${request.url}`);
      }
    });

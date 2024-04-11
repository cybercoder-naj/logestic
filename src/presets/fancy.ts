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

const formatDuration = (duration: bigint) => {
  const durationNumber = Number(duration);
  
  if (durationNumber < 1_000) return `${duration}μs`;
  else if (durationNumber < 1_000_000) return `${(durationNumber / 1_000).toFixed(2)}ms`;
  else if (durationNumber < 60 * 1_000_000) return `${(durationNumber / 1_000_000).toFixed(2)}s`;
  else if (durationNumber < 60 * 60 * 1_000_000) return `${(durationNumber / (60 * 1_000_000)).toFixed(2)}m`;
  else return `${(durationNumber / (60 * 60 * 1_000_000)).toFixed(2)}h`;
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

        const formattedDuration = formatDuration(duration);

        return `${dateTime} ${methodPath} ${formattedDuration}`;
      },
      onFailure({ request, datetime }) {
        const dateTime = getDateTimeString(datetime!!);
        return chalk.red(`${dateTime} ${request.method} ${request.url}`);
      }
    });

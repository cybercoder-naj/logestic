import { PresetValue } from '../types';
import chalk from 'chalk';

const getDateTimeString = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const preset: PresetValue = {
  uses: ['time', 'method', 'path'],
  formatAttr: {
    onSuccess({ time, method, path }) {
      const dateTime = chalk.gray(getDateTimeString(time!!));
      const methodPath = chalk.cyan(`${method} ${path}`);

      return `${dateTime} ${methodPath}`;
    },
    onFailure({ request, datetime }) {
      const dateTime = getDateTimeString(datetime!!);
      return chalk.red(`${dateTime} ${request.method} ${request.url}`);
    }
  }
};

export default preset;

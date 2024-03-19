import { PresetValue } from '../types';
import chalk from 'chalk';

const getDateTimeString = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return chalk.gray(`${day}/${month}/${year} ${hours}:${minutes}:${seconds}`);
};

const preset: PresetValue = {
  uses: ['time', 'method', 'path'],
  formatAttr: ({ time, method, path }) => {
    const dateTime = getDateTimeString(time!!);
    const methodPath = chalk.cyan(`${method} ${path}`);

    return `${dateTime} ${methodPath}`;
  }
};

export default preset;

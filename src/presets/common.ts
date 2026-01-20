import { Logestic } from '..';
import chalk from 'chalk';
import type { LogesticOptions } from '../types';

export default (options: LogesticOptions) =>
  new Logestic(options).use(['time', 'method', 'path', 'status']).format({
    onSuccess({ time, method, path, status }) {
      const grayTime = chalk.gray(`${time!!.toISOString()}`);
      const methodPath = chalk.cyan(`${method} ${path}`);
      let statusColor = chalk.white;

      if (200 <= status && status < 300) statusColor = chalk.green;
      if (400 <= status && status < 500) statusColor = chalk.yellow;
      if (500 <= status) statusColor = chalk.red;

      return `[${grayTime}] ${methodPath} ${statusColor(status)}`;
    },
    onFailure({ request, error, code, datetime }) {
      const grayTime = chalk.gray(`${datetime.toISOString()}`);
      const msg = chalk.red(
        `${request.method} ${request.url} ${error.message} ${code}`
      );
      return `[${grayTime}] ${msg}`;
    }
  });

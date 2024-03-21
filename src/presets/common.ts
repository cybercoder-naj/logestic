import { PresetValue } from '../types';
import chalk from 'chalk';

const preset: PresetValue = {
  uses: ['time', 'method', 'path', 'status'],
  formatAttr: {
    onSuccess: ({ time, method, path, status }) => {
      const grayTime = chalk.gray(`[${time!!.toISOString()}]`);
      const methodPath = chalk.cyan(`${method} ${path}`);
      let statusColor = chalk.white;

      if (200 <= status && status < 300) statusColor = chalk.green;
      if (400 <= status && status < 500) statusColor = chalk.yellow;
      if (500 <= status) statusColor = chalk.red;

      return `[${grayTime}] ${methodPath} ${statusColor(status)}`;
    },
    onFailure: () => ''
  }
};

export default preset;

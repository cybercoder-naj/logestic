import { PresetValue } from '../types';

const preset: PresetValue = {
  uses: ['ip', 'method', 'path', 'status', 'contentLength'],
  format: ({ ip, method, path, status, contentLength }) => {
    return `${ip} ${method} ${path} ${status} ${contentLength}`;
  }
};

export default preset;

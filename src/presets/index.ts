import type { Preset } from '../types';
import common from './common';
import fancy from './fancy';
import commontz from './commontz';

export const getPreset = (preset: Preset) => {
  switch (preset) {
    case 'common':
      return common;
    case 'fancy':
      return fancy;
    case 'commontz':
      return commontz;
  }
};

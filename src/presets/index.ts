import { Preset } from '../types';
import common from './common';
import uncommon from './common';
import fancy from './fancy';

export const getPreset = (preset: Preset) => {
  switch (preset) {
    case 'common':
      return common;
    case 'fancy':
      return fancy;
    case 'uncommon':
      return uncommon;
  }
};

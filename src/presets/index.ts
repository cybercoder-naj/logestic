import { Preset } from '../types';
import common from './common';
import fancy from './fancy';

export const getPreset = (preset: Preset) => {
  switch (preset) {
    case 'common':
      return common;
    case 'fancy':
      return fancy;
  }
};

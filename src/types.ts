/**
 * @module types
 * @description This module provides types for the Logestic module.
 * It includes types for attributes, presets, and options.
 * It also includes a type for the format object.
 */

import { BunFile } from 'bun';

export type Attribute = {
  ip: string;
  method: string;
  path: string;
  body: any;
  query: Record<string, string | undefined>;
  time: Date;
  contentLength: number;
  status: number;
  referer: string;
  userAgent: string;
  duration: bigint;
};

export type ErrorAttribute = {
  request: Request;
  error: Error;
  code: any; // either string description or number
  datetime: Date;
};

/**
 * `Presets` is an object that contains preset configurations for the Logestic module.
 */
export type Preset = 'common' | 'fancy' | 'uncommon';
/**
 * `Callback` is an object that contains functions to format successful and failed logs.
 */
export type Callback<K extends keyof Attribute> = {
  onRequest?: (attr: Request) => string;
  onSuccess: (attr: Pick<Attribute, K>) => string;
  onFailure: (attr: ErrorAttribute) => string;
};

export type LogType = 'http' | 'info' | 'warn' | 'debug' | 'error';
export type LogLevelColour = {
  [key in LogType]?: string;
};

/**
 * `LogesticOptions` is an object that contains options for the Logestic module.
 *
 * @property dest - The logging destination. It cannot be Bun.stdin. Defaults to Bun.stdout.
 * @property showLevel - Whether to show the log level. Defaults to `false`.
 * @property logLevelColour - The colour of each log level.
 * @property httpLogging - Whether to log HTTP requests. Defaults to `true`.
 * @property explicitLogging - Whether to log explicit logs. Defaults to `true`.
 * @see LogLevelColour
 */
export type LogesticOptions = {
  dest?: BunFile;
  showLevel?: boolean;
  logLevelColour?: LogLevelColour;
  httpLogging?: boolean;
  explicitLogging?: boolean;
};

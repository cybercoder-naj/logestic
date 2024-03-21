/**
 * This TypeScript module defines types for logging attributes and presets.
 *
 * The Attribute type is a flexible representation of log entry.
 * AttributeMap is a utility type for toggling these attributes.
 * PresetValue and Presets define structures for preconfigured logging formats.
 */

import { BunFile } from 'bun';
import { Elysia } from 'elysia';

/**
 * `Attribute` is a type representing possible attributes of a log entry.
 * Each attribute is optional and can be of various types.
 */
export type Attribute = {
  ip?: string; // The IP address of the client making the request
  method?: string; // The HTTP method used in the request
  path?: string; // The path of the request
  body?: any; // The body of the request
  query?: Record<string, string | undefined>; // The query parameters of the request
  time?: Date; // The time when the request was made
  contentLength?: number; // The length of the response content
  status?: any; // The status code of the response
  referer?: string; // The referer URL of the request
  userAgent?: string; // The user agent string of the client making the request
};

export type ErrorAttribute = {
  request: Request;
  error: Error;
  code: any; // either string description or number
  datetime: Date;
};

/**
 * `AttributeMap` is a type that maps each key of `Attribute` to a boolean.
 * It is used to indicate which attributes are enabled or disabled.
 */
export type AttributeMap = {
  [key in keyof Attribute]: boolean;
};

/**
 * `Presets` is a type representing a collection of preset configurations.
 * Each key is a preset name and the value is a `PresetValue`.
 */
export type Presets = {
  common: (_: LogesticOptions) => Elysia; // A common preset configuration
  fancy: (_: LogesticOptions) => Elysia;
};

export type FormatObj = {
  onSuccess: (attr: Attribute) => string;
  onFailure: (attr: ErrorAttribute) => string;
};

export type LogType = 'HTTP' | 'INFO' | 'WARN' | 'DEBUG' | 'ERROR';

export type LogesticOptions = {
  dest?: BunFile;
  showType?: boolean;
};

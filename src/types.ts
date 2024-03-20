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
export type Attribute =
  | 'ip' // The IP address of the client making the request
  | 'method' // The HTTP method used in the request
  | 'path' // The path of the request
  | 'body' // The body of the request
  | 'time' // The time when the request was made
  | 'contentLength' // The length of the response content
  | 'status' // The status code of the response
  | 'referer' // The referer URL of the request
  | 'userAgent'; // The user agent string of the client making the request

/**
 * `AttributeMap` is a type that maps each key of `Attribute` to a boolean.
 * It is used to indicate which attributes are enabled or disabled.
 */
export type AttributeMap = {
  [K in Attribute]?: boolean;
};

/**
 * `Presets` is a type representing a collection of preset configurations.
 * Each key is a preset name and the value is a `PresetValue`.
 */
export type Preset = Record<'common' | 'fancy', (_: BunFile) => Elysia>;

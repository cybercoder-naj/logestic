/**
 * @module logestic
 * @description This module provides a class to configure and perform logging.
 */

import Elysia from 'elysia';
import {
  Attribute,
  FormatObj,
  LogLevelColour,
  LogesticOptions,
  Presets
} from './types';
import presets from './presets';
import { BunFile } from 'bun';
import c from 'chalk';
import { buildAttrs, colourLogType } from './utils';

export type { Attribute, LogesticOptions };
export const chalk = c; // Re-export chalk for custom formatting

/**
 * Logestic class provides methods to configure and perform logging.
 */
export class Logestic {
  private requestedAttrs: {
    [key in keyof Attribute]: boolean;
  };
  private dest!: BunFile;
  private showLevel: boolean;
  private logLevelColour: LogLevelColour;
  private httpLogging: boolean;
  private explicitLogging: boolean;

  /**
   * Creates a new Logestic instance.
   *
   * @param options - The options to configure the Logestic instance.
   * @see LogesticOptions
   */
  constructor(options: LogesticOptions = {}) {
    this.requestedAttrs = {};
    this.showLevel = options.showLevel || false;
    this.logLevelColour = options.logLevelColour || {};
    this.httpLogging = options.httpLogging || true;
    this.explicitLogging = options.explicitLogging || true;

    this.setDest(options.dest || Bun.stdout);
  }

  private setDest(dest: BunFile): void {
    if (dest === Bun.stdin) {
      // Cannot log to stdin
      throw new Error(
        'Cannot log to stdin. Please provide a writable destination.'
      );
    }
    if (dest === Bun.stdout || dest === Bun.stderr) {
      // Use stdout or stderr
      this.dest = dest;
      return;
    }

    // Custom file destination
    this.dest = this.createFileIfNotExists(dest);
  }

  private createFileIfNotExists(dest: BunFile): BunFile {
    if (!dest.exists()) {
      Bun.write(dest, '');
    }
    return dest;
  }

  /**
   * Requests Logestic to provide a particular attribute.
   * @param attrs - An attribute key or an array of attribute keys.
   * @returns The Logestic instance for chaining.
   */
  use(attr: keyof Attribute): Logestic;
  use(attrs: (keyof Attribute)[]): Logestic;
  use(attrs: keyof Attribute | (keyof Attribute)[]): Logestic {
    if (Array.isArray(attrs)) {
      for (const attr of attrs) {
        this._use(attr);
      }
      return this;
    }

    // Single attribute
    this._use(attrs);
    return this;
  }

  private _use(attr: keyof Attribute) {
    this.requestedAttrs[attr] = true;
  }

  /**
   * @param name The name of the preset to use.
   * @param options The options to configure the preset. Any options provided will override the preset's default options.
   * @returns A new Elysia instance with the logger plugged in.
   */
  static preset(name: keyof Presets, options: LogesticOptions = {}): Elysia {
    return presets[name](options);
  }

  /**
   * Use this when you do not want any http logging.
   *
   * @returns Elysia instance with the logger plugged in.
   */
  build(this: Logestic) {
    return new Elysia({
      name: 'logestic'
    }).decorate('logestic', this);
  }

  /**
   *
   * @param formatAttr - The format object containing functions to format successful and failed logs.
   * @returns Elysia instance with the logger plugged in.
   */
  format(this: Logestic, formatAttr: FormatObj) {
    return this.build()
      .onAfterHandle({ as: 'global' }, ctx => {
        if (!this.httpLogging) {
          return;
        }

        let attrs = buildAttrs(ctx, this.requestedAttrs);
        let msg = formatAttr.onSuccess(attrs);
        if (this.showLevel) {
          msg = `${colourLogType('http', this.logLevelColour)} ${msg}`;
        }
        this.log(msg);
      })
      .onError({ as: 'global' }, ({ request, error, code }) => {
        let datetime = new Date();
        let msg = formatAttr.onFailure({ request, error, code, datetime });
        if (this.showLevel) {
          msg = `${colourLogType('error', this.logLevelColour)} ${msg}`;
        }
        this.log(msg);
      });
  }

  private async log(msg: string): Promise<void> {
    let content: string | undefined = undefined;
    if (this.dest !== Bun.stdout) {
      content = await this.dest.text();
    }

    const writer = this.dest.writer();
    if (content) {
      writer.write(content);
    }
    writer.write(msg);
    writer.write('\n');
    writer.flush();
  }

  /**
   * Logs an info message to the destination.
   *
   * @param msg The message to log.
   */
  info(msg: string): void {
    if (!this.explicitLogging) {
      return;
    }

    let _msg = msg;
    if (this.showLevel) {
      _msg = `${colourLogType('info', this.logLevelColour)} ${msg}`;
    }
    this.log(_msg);
  }

  /**
   * Logs a warning message to the destination.
   *
   * @param msg The message to log.
   */
  warn(msg: string): void {
    if (!this.explicitLogging) {
      return;
    }

    let _msg = msg;
    if (this.showLevel) {
      _msg = `${colourLogType('warn', this.logLevelColour)} ${msg}`;
    }
    this.log(_msg);
  }

  /**
   * Logs a debug message to the destination.
   *
   * @param msg The message to log.
   */
  debug(msg: string): void {
    if (!this.explicitLogging) {
      return;
    }

    let _msg = msg;
    if (this.showLevel) {
      _msg = `${colourLogType('debug', this.logLevelColour)} ${msg}`;
    }
    this.log(_msg);
  }

  /**
   * Logs an error message to the destination.
   *
   * @param msg The message to log.
   */
  error(msg: string): void {
    if (!this.explicitLogging) {
      return;
    }

    let _msg = msg;
    if (this.showLevel) {
      _msg = `${colourLogType('error', this.logLevelColour)} ${msg}`;
    }
    this.log(_msg);
  }
}

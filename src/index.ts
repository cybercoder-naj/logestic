/**
 * @fileoverview This module provides a logging utility for Elysia, a Node.js framework.
 *   It allows for customizable logging of HTTP requests and responses.
 */

import Elysia from 'elysia';
import { Attribute, FormatObj, Presets } from './types';
import presets from './presets';
import { BunFile } from 'bun';
import c from 'chalk';
import { buildAttrs, colourLogType } from './utils';

export type { Attribute };
export const chalk = c; // Re-export chalk for custom formatting

export type LogesticOptions = {
  dest?: BunFile;
  showType?: boolean;
};

/**
 * Logestic class provides methods to configure and perform logging.
 */
export class Logestic {
  private static defaultOptions: LogesticOptions = {
    dest: Bun.stdout,
    showType: false
  };

  private requestedAttrs: {
    [key in keyof Attribute]: boolean;
  };
  private dest: BunFile;
  private showType: boolean;

  /**
   * Constructs a new Logestic instance.
   * @param dest - Destination of the logs, Defaults to the console logger.
   */
  constructor(options: LogesticOptions = Logestic.defaultOptions) {
    this.requestedAttrs = {};
    this.showType = options.showType || false;

    this.setDest(options.dest);
  }

  private setDest(dest?: BunFile): void {
    if (!dest) {
      // Default to stdout
      this.dest = Bun.stdout;
      return;
    }

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
        this.requestedAttrs[attr] = true;
      }
      return this;
    }

    // Single attribute
    this.requestedAttrs[attrs] = true;
    return this;
  }

  /**
   * Creates a new Elysia instance with a preset logging configuration.
   * @param name - The name of the preset to use.
   * @param dest - A custom logger function. Defaults to the console logger.
   * @returns A new Elysia instance.
   */
  static preset(
    name: keyof Presets,
    options: LogesticOptions = Logestic.defaultOptions
  ): Elysia {
    const { uses, formatAttr } = presets[name];
    return new Logestic(options).use(uses).format(formatAttr);
  }

  /**
   * Configures a custom logging format and attaches it to the Elysia instance.
   * @param formatAttr - A function that takes an Attribute object and returns a string.
   * @returns A new Elysia instance.
   */
  format(formatAttr: FormatObj): Elysia {
    return new Elysia()
      .onAfterHandle({ as: 'global' }, ctx => {
        let attrs = buildAttrs(ctx, this.requestedAttrs);
        let msg = formatAttr.onSuccess(attrs);
        if (this.showType) {
          msg = `${colourLogType('HTTP')} ${msg}`;
        }
        this.log(msg);
      })
      .onError({ as: 'global' }, ({ request, error, code }) => {
        let datetime = new Date();
        let msg = formatAttr.onFailure({ request, error, code, datetime });
        if (this.showType) {
          msg = `${colourLogType('ERROR')} ${msg}`;
        }
        this.log(msg);
      });
  }

  /**
   * Logs a message using the configured logger function.
   * @param msg - The message to log.
   */
  async log(msg: string): Promise<void> {
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
}

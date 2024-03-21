/**
 * @fileoverview This module provides a logging utility for Elysia, a Node.js framework.
 *   It allows for customizable logging of HTTP requests and responses.
 */

import Elysia, { type Context } from 'elysia';
import { Attribute, AttributeMap, FormatObj, Presets } from './types';
import presets from './presets';
import { BunFile } from 'bun';
import c from 'chalk';

export type { Attribute };
export const chalk = c; // Re-export chalk for custom formatting

/**
 * Builds an attribute object containing the requested attributes from the context.
 * @param ctx - The context of the current request.
 * @param reqAttrs - A map of requested attributes.
 * @returns An object containing the requested attributes.
 */
const buildAttrs = (ctx: Context, reqAttrs: AttributeMap): Attribute => {
  const { request, path, body, query, set } = ctx;

  let attrs: Attribute = {};
  for (const key in reqAttrs) {
    const k = key as keyof Attribute;
    switch (k) {
      case 'ip':
        attrs.ip = request.headers.get('x-forwarded-for') || '<ip?>';
        break;

      case 'method':
        attrs.method = request.method;
        break;

      case 'path':
        attrs.path = path;
        break;

      case 'body':
        attrs.body = body;
        break;

      case 'query':
        attrs.query = query;
        break;

      case 'time':
        attrs.time = new Date();
        break;

      case 'contentLength':
        attrs.contentLength = Number(request.headers.get('content-length'));
        break;

      case 'status':
        attrs.status = set.status;
        break;

      case 'referer':
        attrs.referer = request.headers.get('referer') || '<referer?>';
        break;

      case 'userAgent':
        attrs.userAgent = request.headers.get('user-agent') || '<user-agent?>';
        break;
    }
  }

  return attrs;
};

/**
 * Logestic class provides methods to configure and perform logging.
 */
export class Logestic {
  private requestedAttrs: {
    [key in keyof Attribute]: boolean;
  };
  private dest: BunFile;

  /**
   * Constructs a new Logestic instance.
   * @param dest - Destination of the logs, Defaults to the console logger.
   */
  constructor(dest: BunFile = Bun.stdout) {
    this.requestedAttrs = {};

    if (dest === Bun.stdin) {
      throw new Error(
        'Cannot log to stdin. Please provide a writable destination.'
      );
    }
    this.dest = this.createFileIfNotExists(dest);
  }

  private createFileIfNotExists(dest: BunFile): BunFile {
    if (dest === Bun.stdout || dest === Bun.stderr) {
      return dest;
    }

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
  static preset(name: keyof Presets, dest: BunFile = Bun.stdout): Elysia {
    const { uses, formatAttr } = presets[name];
    return new Logestic(dest).use(uses).format(formatAttr);
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
        const msg = formatAttr.onSuccess(attrs);
        this.log(msg);
      })
      .onError({ as: 'global' }, ({ request, error, code }) => {
        let datetime = new Date();
        const msg = formatAttr.onFailure({ request, error, code, datetime });
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

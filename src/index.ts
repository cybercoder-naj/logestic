/**
 * @fileoverview This module provides a logging utility for Elysia, a Node.js framework.
 *   It allows for customizable logging of HTTP requests and responses.
 */

import Elysia, { Context } from 'elysia';
import { Attribute, AttributeMap, Presets } from './types';
import presets from './presets';
import { BunFile } from 'bun';

export type { Attribute };

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
   * @param dest - A custom logger function. Defaults to the console logger.
   */
  constructor(dest: BunFile = Bun.stdout) {
    this.requestedAttrs = {};
    this.dest = dest;
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
    const { uses, format } = presets[name];
    return new Logestic(dest).use(uses).custom(format);
  }

  /**
   * Configures a custom logging format and attaches it to the Elysia instance.
   * @param format - A function that takes an Attribute object and returns a string.
   * @returns A new Elysia instance.
   */
  custom(format: (attr: Attribute) => string): Elysia {
    return new Elysia()
      .onAfterHandle({ as: 'global' }, ctx => {
        let attrs = buildAttrs(ctx, this.requestedAttrs);
        const msg = format(attrs);
        this.log(msg);
      })
      .onError({ as: 'global' }, ({ request, error }) => {
        this.log(`Error: ${request.method} ${request.url} ${error.message}`);
      });
  }

  /**
   * Logs a message using the configured logger function.
   * @param msg - The message to log.
   */
  async log(msg: string): Promise<void> {
    let content: string | undefined = undefined;
    if (this.dest !== Bun.stdout) {
      if (!(await this.dest.exists())) {
        Bun.write(this.dest, '');
      }
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

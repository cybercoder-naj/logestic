import { type Context } from 'elysia';
import type { AttributeMap, Attribute, LogType, LogLevelColour } from './types';
import chalk, { ChalkInstance } from 'chalk';

/**
 * Builds an attribute object containing the requested attributes from the context.
 * @param ctx - The context of the current request.
 * @param reqAttrs - A map of requested attributes.
 * @returns An object containing the requested attributes.
 */
export const buildAttrs = (ctx: Context, reqAttrs: AttributeMap): Attribute => {
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

export const colourLogType = (
  type: LogType,
  colourDef: LogLevelColour
): string => {
  let bgColour: ChalkInstance = chalk.bgBlack;
  switch (type) {
    case 'http':
      bgColour =
        (colourDef[type] && chalk.hex(colourDef[type]!!)) || chalk.bgBlue;
      break;

    case 'info':
      bgColour =
        (colourDef[type] && chalk.hex(colourDef[type]!!)) || chalk.bgGreen;
      break;

    case 'warn':
      bgColour =
        (colourDef[type] && chalk.hex(colourDef[type]!!)) || chalk.bgYellow;
      break;

    case 'debug':
      bgColour =
        (colourDef[type] && chalk.hex(colourDef[type]!!)) || chalk.bgCyan;
      break;

    case 'error':
      bgColour =
        (colourDef[type] && chalk.hex(colourDef[type]!!)) || chalk.bgRed;
      break;
  }

  const withSpaces = ` ${type.toUpperCase()} `;
  return bgColour?.(withSpaces) ?? withSpaces;
};

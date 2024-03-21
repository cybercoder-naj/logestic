import { type Context } from 'elysia';
import type { AttributeMap, Attribute } from './types';

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

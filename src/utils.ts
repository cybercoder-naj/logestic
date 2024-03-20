import type { Attribute } from './types';
import { Type, type TSchema } from '@sinclair/typebox';

export function getAttributeType(attr: Attribute): TSchema {
  switch (attr) {
    case 'ip':
      return Type.String();
    case 'method':
      return Type.String();
    case 'path':
      return Type.String();
    case 'body':
      return Type.Any();
    case 'time':
      return Type.Date();
    case 'contentLength':
      return Type.Number();
    case 'status':
      return Type.Number();
    case 'referer':
      return Type.String();
    default:
      throw new Error(`Unknown attribute: ${attr}`);
  }
}

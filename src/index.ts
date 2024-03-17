import Elysia, { Context } from 'elysia';

export type Attribute = {
  ip?: string;
  method?: string;
  path?: string;
  body?: any;
  query?: Record<string, string | undefined>;
  time?: Date;
  contentLength?: number;
  status?: any;
  referer?: string;
  userAgent?: string;
};

type PresetValue = {
  uses: (keyof Attribute)[];
  format: (attr: Attribute) => string;
};

type Presets = {
  common: PresetValue;
};

type AttrBitMap = {
  [key in keyof Attribute]: boolean;
};

const presetDef: Presets = {
  common: {
    uses: ['ip', 'method', 'path', 'status', 'contentLength'],
    format: ({ ip, method, path, status, contentLength }) => {
      return `${ip} ${method} ${path} ${status} ${contentLength}`;
    }
  }
};

const buildAttrs = (ctx: Context, reqAttrs: AttrBitMap): Attribute => {
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
        attrs.contentLength = Number(
          request.headers.get('content-length')
        );
        break;

      case 'status':
        attrs.status = set.status;
        break;

      case 'referer':
        attrs.referer = request.headers.get('referer') || '<referer?>';
        break;

      case 'userAgent':
        attrs.userAgent =
          request.headers.get('user-agent') || '<user-agent?>';
        break;
    }
  }

  return attrs;
}

export class Logestic {
  private requestedAttrs: {
    [key in keyof Attribute]: boolean;
  };
  private logger: (msg: string) => void;

  private static defaultLogger = (msg: string): void => {
    console.log(msg);
  };

  constructor(logger: typeof Logestic.defaultLogger = Logestic.defaultLogger) {
    this.requestedAttrs = {};
    this.logger = logger;
  }

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

  static preset(
    name: keyof Presets,
    logger: typeof Logestic.defaultLogger = Logestic.defaultLogger
  ): Elysia {
    const { uses, format } = presetDef[name];
    return new Logestic(logger).use(uses).custom(format);
  }

  custom(format: (attr: Attribute) => string): Elysia {
    return new Elysia()
      .onAfterHandle({ as: 'global' }, ctx => {
        let attrs = buildAttrs(ctx, this.requestedAttrs);
        const msg = format(attrs);
        this.log(msg);
      })
      .onError({ as: 'global' }, ({ request, error }) => {
        this.log(
          `Error: ${request.method} ${request.url} ${error.message}`
        );
      });
  }

  log(msg: string): void {
    this.logger(msg);
  }
}

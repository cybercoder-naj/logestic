# Logestic

An advanced and customisable logging library for [ElysiaJS](https://elysiajs.com).

## Table of Contents

- [Logestic](#logestic)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
  - [Preset request logging](#preset-request-logging)
  - [Custom request logging](#custom-request-logging)
- [Contributing Guidelines](#contributing-guidelines)
- [License](#license)
- [Authors](#authors)

## Installation

Add the package to your Elysia Project. 
```bash
  bun add logestic
```
**Note**: You must have `elysia@1.0` installed in your project.

## Usage

There are two ways to add logging to your Elysia application.

### Preset request logging

Currently, there are these [presets](./src/presets/index.ts) available to use. 

```typescript
import { Elysia } from 'elysia';
import { Logestic } from 'logestic';

const app = new Elysia()
  .use(Logestic.preset('common'))
  .get('/', () => "Hello from server")
  .listen(5566);
```

### Custom request logging

If you don't like any of presets, you can configure Logestic to log your requests in your way.

1. Create a `Logestic` instance, optionally where you wish to log.
2. Call `use` to tell `Logestic` the information you wish to use.
3. Finally, create an `Elysia` instance on `custom` with the formatting function. 

```typescript
// ./logger.ts
import { Logestic } from 'logestic';

// exports an Elysia instance
export default new Logestic(Bun.file('request.log'))
  .use(['method', 'path', 'time', 'status'])
  .custom(({ method, path, time, status }) => {
    return `[${time}]: ${method} ${path} | ${status}`
  });


// ./index.ts
import myLogger from './logger';

const app = new Elysia()
  .use(myLogger)
  .get('/', () => "Hello from server")
  .listen(5566);
```

Consider contributing your own preset; check [contributing guidelines](#contributing-guidelines).

## Contributing Guidelines

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

[MIT](./LICENSE)

## Authors

- [@cybercoder-naj](https://github.com/cybercoder-naj)

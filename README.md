# Logestic

[![npm version](https://badge.fury.io/js/logestic.svg)](https://badge.fury.io/js/logestic)

An advanced and customisable logging library for [ElysiaJS](https://elysiajs.com).

<div align="center">
<img src="screenshots/fancy.png" alt="fancy preset">
</div

## Table of Contents

- [Logestic](#logestic)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
- [Documentation](#documentation)
- [Contributing Guidelines](#contributing-guidelines)
- [License](#license)

## Installation

Add the package to your Elysia Project via [bun](https://bun.sh). 
```bash
  bun add logestic
```
**Note**: You must have `elysia@1.0` installed in your project.

## Usage

There are two ways to add logging to your Elysia application. The quickest way to use this logger is using a preset. 

```typescript
import { Elysia } from 'elysia';
import { Logestic } from 'logestic';

const app = new Elysia()
  .use(Logestic.preset('common'))
  .get('/', () => "Hello from server")
  /* ... */
  .listen(3000, () => {
    console.log("Server is running on port 3000")
  });
```

These [presets](https://github.com/cybercoder-naj/logestic/wiki/Presets) available to use. 

## Documentation

To view the full documentation, view the [wiki](https://github.com/cybercoder-naj/logestic/wiki/).

## Contributing Guidelines

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

[MIT](./LICENSE)

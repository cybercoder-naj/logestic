# CHANGELOG

## Unreleased
### Added
- GitHub Actions to automate the release workflow. ([#29](https://github.com/cybercoder-naj/logestic/pull/29))

## [1.2.0] - 27-05-2024
### Added
- New preset `commontz`, which is similar to `common` but logs the time in server's timezone. ([#28](https://github.com/cybercoder-naj/logestic/pull/28))

## [1.1.1] - 07-04-2024
### Fixed
- `onSuccess` receiving undefined values in parameters.

## [1.1.0] - 31-03-2024
### Added
- Optional `onRequest` logging formatter for hooking onto onRequest. ([#13](https://github.com/cybercoder-naj/logestic/issues/13))

## [1.0.1] - 30-03-2024
### Added
- Type-safety to onSuccess method, based on attributes passed on `use`. ([#6](https://github.com/cybercoder-naj/logestic/issues/6))

### Fixed
- Status of type `number` and not `any`. ([#5](https://github.com/cybercoder-naj/logestic/issues/5))

## [1.0.0] - 27-03-2024
- First stable release! 🎆

## [1.0.0-alpha.6] - 27-03-2024
### Fixed
- Fix issues related to file logging. ([#14](https://github.com/cybercoder-naj/logestic/issues/14))

## [1.0.0-alpha.5] - 26-03-2024
### Changed
- Request duration returns time in microseconds.
- `fancy` preset includes the duration on successful requests.

### Fixed
- Incorrect status code when returning with `error` function ([#11](https://github.com/cybercoder-naj/logestic/issues/11))

## [1.0.0-alpha.4] - 26-03-2024
### Added
- Request duration as a logging feature ([#10](https://github.com/cybercoder-naj/logestic/issues/10))

## [1.0.0-alpha.3] - 25-03-2024
### Changed
- README file and updated the Wiki page.

### Fixed
- Default configuration for `fancy` preset.

## [1.0.0-alpha.2] - 21-03-2024
### Added
- Customisable log type/level colour.
- Option to disable implicit and explicit logging.
- `build` function to create a logger wihout any `httpLogging`.

### Changed
- Passing in options will override preset options.
- Type loss when using Logestic middleware.

## [1.0.0-alpha.1] - 21-03-2024
*Redacted. see 1.0.0-alpha.2 for changes*

## [0.5.0] - 21-03-2024
### Added
- Origin/level of the log message, 'HTTP', 'ERROR', 'WARN', 'DEBUG', 'INFO'.
- `info`, `warn`, `debug`, `error` functions are added for custom logging throughout the application.

### Changed
- **BREAKING CHANGE**: `Logestic` accepts an options object instead of a destination file.
- **BREAKING CHANGE**: `log` is a private function. Replace all usages of `log` function with `info` function.
- Presets definition returns an `Elysia` instance.

## [0.4.0] - 21-03-2024
### Added
- Custom Error logging when request fails.

### Changed
- **BREAKING CHANGE**: Custom logging functionality accepts an object of two functions, `onSuccess` and `onFailure`.


## [0.3.0] - 19-03-2024
### Added
- New logging preset: `'fancy'`

### Changed
- **BREAKING CHANGE**: renamed `custom` function to `format`

This is the first version to be documented in the changelog. Previous changes are not recorded.

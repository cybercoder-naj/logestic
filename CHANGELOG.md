# CHANGELOG
## [1.0.0-alpha.4] - 26-03-2024
### Added
- Request duration as a logging feature

### Fixed
- Incorrect status code when returning with `error` function

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
# CHANGELOG
## [1.0.0-alpha.1] - 21-03-2024
### Added
- Customisable log type/level colour.

### Changed
- Passing in options will override preset options.

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
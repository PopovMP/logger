# A simple Logger helper for nodejs

**logger** is a straightforward logger written in TypeScript. It logs to a
single predefined file. When an option `{tee: true}` is given, **logger** shows
colored messages in the console. If a log file is not defined, **logger** writes
to the console only.

Homepage: https://github.com/popovmp/logger

## Installation

```
npm install @popovmp/logger
```

## Usage

````javascript
import {initLogger, logError, logSuccess, logWarning} from "./lib/logger.mts";

// Init logger
const loggerOptions = {
  filepath: "my/logger/path/log.txt",
  tee     : true,
  suppress: ["debug"]
};

initLogger(loggerOptions);


**logger** must be initialized with the path to the log file in order to write the log.
It is a good idea to set the path relative to `__dirname`.

If you don't want the logger to write to a file, you may skip the `init` part or to call it without args.
The logger will only show the messages in the terminal in that case.

If **logger** is not initialized, it writes to the console.
It allows it to be used in modules without initialization.

You have to initialize the logger only once. It is best to do it in the application main script `index.mts`.

**logger** writes to the log file asynchronously (aka Fire and Forget).
You can log only a message, or a message and sender. Sender can be a method name or other hint.

There are three log methods: `logger.info`, `logger.error`, and `logger.text`.

The methods `logger.info`, `logger.error` logs:

  - a date and time in [yyyy-dd-MM hh:mm:ss] format
  - tag `[INFO]` or `[ERROR]`. the tags help to search the log file or `grep` it by a tag.
  - sender (optional) in `[sender]` format (if provided).

The `logger.text` method logs only the provided message. It doesn't log a date, a label or a sender.

```javascript

logInfo("Hello, World!");                          // => 2020-08-21 06:21:11 [INFO] Hello, World!
logInfo("GET index", "app::router");               // => 2020-08-21 06:21:11 [INFO] [app::router] GET index
logError("Ohh!", "bank::delete-account");          // => 2020-08-21 06:21:11 [ERROR] [bank::delete-account] Ohh!
logText("So Long, and Thanks for All the Fish!");  // => So Long, and Thanks for All the Fish!
````

## Last error

**logger** has two methods for getting and resetting the last logged error
message: `getLastError` and `resetLastError`.

`getLastError` returns the last logged error message by the `logError` or
`logger.error` methods.

You can reset the last error with the `resetLastError` method. When
`resetLastError` is called without parameters, it sets the last error to
`undefined`. `resetLastError` can be called with `null` to set the last error to
`null`.

```javascript
getLastError(); // undefined
logError("some eror");
getLastError(); // some error
resetLastError();
getLastError(); // undefined
```

## Options

The `filepath` option sets the log filepath.

The `init` method accepts an options `options` parameter. It has two property
`tee: boolean` and `suppress: string[]`.

When `tee` is set to `true`, the logger doubles the message on the console.

The `suppress` parameter accepts a string[]. It suppresses the logging of the
tags included.

The possible values are:

```json
{
  "suppress": ["debug", "text", "info", "error", "success"]
}
```

## Methods

**logger** exports the following methods:

```javascript
/**
 * @param {LoggerOptions} loggerOptions
 * @returns {void}
 */
logger.init(loggerOptions);
```

```javascript
/**
 * Logs a debug message to a log file
 *
 * @param {Error|object|string} message
 * @param {string} [sender]
 */
logDebug(message, sender);
```

```javascript
/**
 * Logs a message to a log file
 *
 * @param {Error|object|string} message
 * @param {string} [sender]
 */
logInfo(message, sender);
```

```javascript
/**
 * Logs an error to a log file
 *
 * @param {Error|object|string} message
 * @param {string} [sender]
 */
logEror(message, sender);
```

```javascript
/**
 * Logs a success information to a log file
 *
 * @param {object|string} message
 * @param {string} [sender]
 */
logSuccess(message, sender);
```

```javascript
/**
 * Logs an error to a log file
 *
 * @param { string } message
 */
logText(message);
```

```javascript
/**
 * Logs a debug message to a log file
 *
 * @param {Error|object|string} message
 * @param {string} [sender]
 */
logger.debug(message, sender);
```

```javascript
/**
 * Logs a message to a log file
 *
 * @param {Error|object|string} message
 * @param {string} [sender]
 */
logger.info(message, sender);
```

```javascript
/**
 * Logs an error to a log file
 *
 * @param {Error|object|string} message
 * @param {string} [sender]
 */
logger.error(message, sender);
```

```javascript
/**
 * Logs a success information to a log file
 *
 * @param {string} message
 * @param {string} [sender]
 */
logger.success(message, sender);
```

```javascript
/**
 * Logs an error to a log file
 *
 * @param {string} message
 */
logger.text(message);
```

## License

`logger` is free for use and modification. No responsibilities for damages of
any kind.

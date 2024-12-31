// noinspection JSUnusedGlobalSymbols

import {EOL}                                  from "node:os";
import {existsSync, mkdirSync, writeFileSync} from "node:fs";
import {dirname}                              from "node:path";
import console                                from "node:console";

import {appendAndForget} from "@popovmp/file-writer";

/** @typedef {"debug"|"error"|"warning"|"info"|"success"|"text"} LogLevel */

/**
 * @typedef {object}      LoggerOptions
 * @property {string}     [filepath]
 * @property {boolean}    [tee]
 * @property {LogLevel[]} [suppress]
 */

/** @type {{
 *    filepath: string;
 *    tee     : boolean;
 *    suppress: LogLevel[];
 * }}
 */
const options = {
    filepath: "",
    tee     : false,
    suppress: [],
};

/** @type {Error|object|string|undefined|null} */
let lastError = undefined;

/** @type {Record<LogLevel, string>} */
const tagMap = {
    debug  : "[DEBUG]",
    error  : "[ERROR]",
    warning: "[WARNING]",
    info   : "[INFO]",
    success: "[SUCCESS]",
    text   : "",
};

/** @type {Record<LogLevel, string>} */
const logColorMap = {
    debug  : "\x1b[33m", // yellow
    warning: "\x1b[33m", // yellow
    error  : "\x1b[31m", // red
    info   : "",
    success: "\x1b[32m", // green
    text   : "",
};

/** @type {string} */
const resetColor = "\x1b[0m";

/**
 * @param {LoggerOptions} loggerOptions
 * @returns {void}
 */
export function initLogger(loggerOptions) {
    if (typeof loggerOptions.filepath === "string") {
        options.filepath = loggerOptions.filepath;
    }
    if (typeof loggerOptions.tee === "boolean") {
        options.tee = loggerOptions.tee;
    }
    if (Array.isArray(loggerOptions.suppress)) {
        options.suppress = loggerOptions.suppress.slice();
    }

    if (options.filepath !== "" && !existsSync(options.filepath)) {
        mkdirSync(dirname(options.filepath), {recursive: true});
        writeFileSync(options.filepath, "", "utf8");
    }

    if (options.filepath === "") {
        options.tee = true;
    }

    Object.freeze(options);
}

/**
 * Logs an error to a log file
 *
 * @param {Error|object|string} message
 * @param {string} [sender]
 *
 * @return {void}
 */
export function logError(message, sender) {
    lastError = message;
    logMessage("error", message, sender);
}

/**
 * Logs a debug message to a log file
 *
 * @param {Error|object|string} message
 * @param {string} [sender]
 *
 * @return {void}
 */
export function logDebug(message, sender) {
    logMessage("debug", message, sender);
}

/**
 * Logs a warning message to a log file
 *
 * @param {Error|object|string} message
 * @param {string} [sender]
 *
 * @return {void}
 */
export function logWarning(message, sender) {
    logMessage("warning", message, sender);
}

/**
 * Logs a message to a log file
 *
 * @param {Error|object|string} message
 * @param {string} [sender]
 *
 * @return {void}
 */
export function logInfo(message, sender) {
    logMessage("info", message, sender);
}

/**
 * Logs a success message to a log file
 *
 * @param {string} message
 * @param {string} [sender]
 *
 * @return {void}
 */
export function logSuccess(message, sender) {
    logMessage("success", message, sender);
}

/**
 * Logs a text message
 *
 * @param {string} message
 *
 * @return {void}
 */
export function logText(message) {
    logMessage("text", message);
}

/**
 * Gets the last logged error message
 *
 * @return {Error|object|string|undefined|null}
 */
export function getLastError() {
    return lastError;
}

/**
 * Resets the last error
 *
 * @param {Error|object|string|undefined|null} value
 *
 * @return {void}
 */
export function resetLastError(value = null) {
    lastError = value;
}

/**
 * Logs a message to a log file
 *
 * @param {LogLevel}            tag
 * @param {Error|object|string} message
 * @param {string}              [sender]
 *
 * @returns {void}
 */
function logMessage(tag, message, sender) {
    if (options.suppress.includes(tag)) return;

    const text = ["info", "error", "debug", "warning", "success"].includes(tag)
        ? composeMessage(tag, message, sender)
        : message;

    if (options.filepath !== "") {
        try {
            appendAndForget(options.filepath, text + EOL);
        } catch (/** @type {any} */ error) {
            console.error("Failed to write to log file", error);
        }
    }

    if (options.tee) {
        console.log(logColorMap[tag] + text + resetColor);
    }
}

/**
 * Composes the log text.
 *
 * @param {LogLevel} tag
 * @param {any}      message
 * @param {string}   [sender]
 *
 * @returns {string}
 */
function composeMessage(tag, message, sender) {
    const timeText   = getLocalTimeText();
    const senderText = sender ? `[${sender}] ` : "";

    let messageText;
    if (typeof message === "object") {
        messageText = message.message || JSON.stringify(message, null, 2);
    } else {
        messageText = String(message);
    }

    return `${timeText} ${tagMap[tag]} ${senderText}${messageText}`;
}

/**
 * Formats time to string
 * Example: 2021-12-05 08:59:59
 * @returns { string }
 */
function getLocalTimeText() {
    /** @type {Date} */
    const now = new Date();

    const year   =  now.getFullYear();
    const month  = (now.getMonth() + 1).toString().padStart(2, "0");
    const day    =  now.getDate()      .toString().padStart(2, "0");
    const hour   =  now.getHours()     .toString().padStart(2, "0");
    const minute =  now.getMinutes()   .toString().padStart(2, "0");
    const second =  now.getSeconds()   .toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

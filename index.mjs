// noinspection JSUnusedGlobalSymbols

import {EOL}                                  from "node:os";
import {existsSync, mkdirSync, writeFileSync} from "node:fs";
import {dirname}                              from "node:path";
import console                                from "node:console";

import {appendAndForget} from "@popovmp/file-writer";

/**
 * @typedef {object} LoggerOptions
 *
 * @property {boolean}  [tee=false] - whether to log to console
 * @property {string[]} [suppress=[]] - tags to suppress.
 *   Possibilities: ["debug", "warning", "error", "info", "success", "text"]
 */

/** @type {LoggerOptions} */
const loggerOptions = {
    tee     : false,
    suppress: [],
};

/** @type {string} */
let logPath = "";
let isInit  = false;

/** @type {Error|object|string|undefined|null} */
let lastError = undefined;

/** @type {Record<string, string>} */
const tagMap = {
    debug  : "[DEBUG]",
    error  : "[ERROR]",
    warning: "[WARNING]",
    info   : "[INFO]",
    success: "[SUCCESS]",
    text   : "",
};

/** @type {Record<string, string>} */
const colors = {
    reset  : "\x1b[0m",
    debug  : "\x1b[33m", // yellow
    warning: "\x1b[33m", // yellow
    error  : "\x1b[31m", // red
    info   : "",
    success: "\x1b[32m", // green
    text   : "",
};

/**
 * Sets the log path.
 *
 *
 * @param {string } [logFilePath=""] - Path to the log file.
 *
 * @param {LoggerOptions} [options={}] - Logger options
 */
export function initLogger(logFilePath = "", options = {}) {
    logPath = logFilePath;
    isInit  = true;

    if (typeof options.tee === "boolean") {
        loggerOptions.tee = options.tee;
    }

    if (Array.isArray(options.suppress)) {
        loggerOptions.suppress = options.suppress.slice();
    }

    if (logPath !== "" && !existsSync(logPath)) {
        mkdirSync(dirname(logPath), {recursive: true});
        writeFileSync(logPath, "", "utf8");
    }
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
 * @param {string}              tag
 * @param {Error|object|string} message
 * @param {string}              [sender]
 *
 * @returns {void}
 */
function logMessage(tag, message, sender) {
    if (loggerOptions.suppress && loggerOptions.suppress.includes(tag)) {
        return;
    }

    const text = ["info", "error", "debug", "warning", "success"].includes(tag)
        ? composeMessage(tag, message, sender)
        : message;

    if (isInit && logPath !== "") {
        try {
            appendAndForget(logPath, text + EOL);
        } catch (/** @type {any} */ error) {
            console.error("Failed to write to log file", error);
        }
    }

    if (!isInit || loggerOptions.tee || logPath === "") {
        console.log(colors[tag] + text + colors.reset);
    }
}

/**
 * Composes the log text.
 *
 * @param {string} tag
 * @param {any}    message
 * @param {string} [sender]
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
    /** @type { Date } */
    const now = new Date();

    const year   =  now.getFullYear();
    const month  = (now.getMonth() + 1).toString().padStart(2, "0");
    const day    =  now.getDate()      .toString().padStart(2, "0");
    const hour   =  now.getHours()     .toString().padStart(2, "0");
    const minute =  now.getMinutes()   .toString().padStart(2, "0");
    const second =  now.getSeconds()   .toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

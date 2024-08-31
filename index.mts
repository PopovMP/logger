// noinspection JSUnusedGlobalSymbols

import {EOL}                                  from "node:os";
import {writeFileSync, mkdirSync, existsSync} from "node:fs";
import {dirname}                              from "node:path";

import {appendAndForget} from "@popovmp/file-writer";

type LoggerTag = "debug" | "error" | "warning" | "info" | "success" | "text";
type ColorTag  = LoggerTag | "reset";

export interface LoggerOptions {
    filename: string;
    tee     : boolean;
    suppress: LoggerTag[];
}

const options: LoggerOptions = {
    filename: "",
    tee     : false,
    suppress: [],
};

let isInit   : boolean = false;
let lastError: Error|object|string|undefined|null = undefined;

const tagMap: Record<LoggerTag, string> = {
    debug  : "[DEBUG]",
    error  : "[ERROR]",
    info   : "[INFO]",
    success: "[SUCCESS]",
    text   : "",
    warning: "[WARNING]",
};

const colors: Record<ColorTag, string> = {
    debug  : "\x1b[33m", // yellow
    error  : "\x1b[31m", // red
    info   : "",
    reset  : "\x1b[0m",
    success: "\x1b[32m", // green
    text   : "",
    warning: "\x1b[33m", // yellow
};

export function initLogger(opt: LoggerOptions): void {
    isInit  = true;

    if (opt.filename) {
        options.filename = opt.filename;
    }

    if (opt.tee) {
        options.tee = opt.tee;
    }

    if (Array.isArray(opt.suppress)) {
        options.suppress = opt.suppress.slice();
    }

    if (options.filename !== "" && !existsSync(options.filename)) {
        mkdirSync(dirname(options.filename), {recursive: true});
        writeFileSync(options.filename, "", "utf8");
    }
}

export function logError(message: string, sender: string): void {
    lastError = message;
    logMessage("error", message, sender);
}

export function logDebug(message: string, sender: string): void {
    logMessage("debug", message, sender);
}

export function logWarning(message: string, sender: string): void {
    logMessage("warning", message, sender);
}

export function logInfo(message: string, sender: string): void {
    logMessage("info", message, sender);
}

export function logSuccess(message: string, sender: string): void {
    logMessage("success", message, sender);
}

export function logText(message: string): void {
    logMessage("text", message, "");
}

export function getLastError(): Error | object | string | undefined | null {
    return lastError;
}

export function resetLastError(value: string | undefined | null = null): void {
    lastError = value;
}

function logMessage(tag: LoggerTag, message: string, sender: string): void {
    if (options.suppress.includes(tag)) return;

    if (tag !== "text") {
        message = composeMessage(tag, message, sender);
    }

    if (isInit && options.filename !== "") {
        try {
            appendAndForget(options.filename, message + EOL);
        } catch (err) {
            console.log((err as Error).message);
        }
    }

    if (options.tee || !isInit || options.filename === "") {
        console.log(colors[tag] + message + colors.reset);
    }
}

function composeMessage(tag: LoggerTag, message: string, sender: string): string {
    const timeText  : string = getLocalTimeText();
    const senderText: string = sender ? `[${sender}] ` : "";

    return `${timeText} ${tagMap[tag]} ${senderText}${message}`;
}

function getLocalTimeText(): string {
    const now: Date = new Date();

    const year    = now.getFullYear();
    const month   = ("0" +(now.getMonth()+1)).slice(-2);
    const day     = ("0" + now.getDate()    ).slice(-2);
    const hours   = ("0" + now.getHours()   ).slice(-2);
    const minutes = ("0" + now.getMinutes() ).slice(-2);
    const seconds = ("0" + now.getSeconds() ).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

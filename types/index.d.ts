// types/index.d.ts
// noinspection JSUnusedGlobalSymbols

declare module "@popovmp/logger" {
    export type LogLevel = "debug" | "warning" | "error" | "info" | "success" | "text";

    export interface LoggerOptions {
        tee     ?: boolean;
        suppress?: LogLevel[];
    }

    export function initLogger(logFilePath: string, options: LoggerOptions): void;

    export function logError  (message: Error|object|string, sender?: string): void;
    export function logDebug  (message: Error|object|string, sender?: string): void;
    export function logWarning(message: Error|object|string, sender?: string): void;
    export function logInfo   (message: Error|object|string, sender?: string): void;
    export function logSuccess(message: Error|object|string, sender?: string): void;

    export function logText(message: string): void;

    export function getLastError(): Error|object|string|undefined|null;
    export function resetLastError(value: Error|object|string|undefined|null): void
}

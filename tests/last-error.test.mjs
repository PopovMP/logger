"use strict";

import {strictEqual}  from "node:assert";
import {describe, it} from "node:test";

import {getLastError, logError, resetLastError} from "../index.mjs";

describe("lastError", () => {
    it("initial lastError is undefined", () => {
        const actual = getLastError();
        strictEqual(actual, undefined);
    });

    it("when logError, gets the correct lastError", () => {
        const expected = "some last error";
        logError(expected);
        const actual = getLastError();
        strictEqual(actual, expected);
    });

    it("reset lastError without arguments", () => {
        resetLastError();
        const actual = getLastError();
        strictEqual(actual, null);
    });

    it("reset lastError to null", () => {
        resetLastError(null);
        const actual = getLastError();
        strictEqual(actual, null);
    });
});

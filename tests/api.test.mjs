"use strict";

import {strictEqual}  from "node:assert";
import {describe, it} from "node:test";

import {logDebug, logError, logInfo, logSuccess, logText} from "../index.mjs";

describe("logger API", () => {
    it("logError(message, sender)", () => {
        strictEqual(typeof logError, "function");
        strictEqual(logError.length, 2);
    });

    it("logDebug(message, sender)", () => {
        strictEqual(typeof logDebug, "function");
        strictEqual(logDebug.length, 2);
    });

    it("logInfo(message, sender)", () => {
        strictEqual(typeof logInfo, "function");
        strictEqual(logInfo.length, 2);
    });

    it("logSuccess(message, sender)", () => {
        strictEqual(typeof logSuccess, "function");
        strictEqual(logSuccess.length, 2);
    });

    it("logText(message)", () => {
        strictEqual(typeof logText, "function");
        strictEqual(logText.length, 1);
    });
});

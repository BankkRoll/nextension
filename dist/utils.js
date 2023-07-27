"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.pressAnyKeyToContinue = exports.clearConsole = exports.stopSpinner = exports.createSpinner = exports.log = exports.createError = exports.CustomError = void 0;
var chalk = require('chalk');
var ora = require('ora');
var readline = require('readline');
var CustomError = (function (_super) {
    __extends(CustomError, _super);
    function CustomError(code, message) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        _this.message = message;
        return _this;
    }
    return CustomError;
}(Error));
exports.CustomError = CustomError;
function createError(code, message) {
    return new CustomError(code, message);
}
exports.createError = createError;
function log(message, type, spinner) {
    if (type === void 0) { type = 'info'; }
    var timestamp = new Date().toISOString();
    switch (type) {
        case 'info':
            console.log(chalk.blue("[".concat(timestamp, " INFO]: ").concat(message)));
            break;
        case 'error':
            console.error(chalk.red("[".concat(timestamp, " ERROR]: ").concat(message)));
            break;
        case 'warning':
            console.warn(chalk.yellow("[".concat(timestamp, " WARNING]: ").concat(message)));
            break;
        case 'success':
            console.log(chalk.green("[".concat(timestamp, " SUCCESS]: ").concat(message)));
            break;
        case 'spinner':
            if (spinner) {
                spinner.text = message;
            }
            break;
    }
}
exports.log = log;
function createSpinner(text) {
    return ora({ text: text, color: 'blue' }).start();
}
exports.createSpinner = createSpinner;
function stopSpinner(spinner, text, type) {
    if (type === 'success') {
        spinner.succeed(chalk.green(text));
    }
    else if (type === 'fail') {
        spinner.fail(chalk.red(text));
    }
    else {
        spinner.info(chalk.blue(text));
    }
}
exports.stopSpinner = stopSpinner;
function clearConsole() {
    process.stdout.write('\x1Bc');
}
exports.clearConsole = clearConsole;
function pressAnyKeyToContinue(prompt) {
    if (prompt === void 0) { prompt = 'Press any key to continue...'; }
    return new Promise(function (resolve) {
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(prompt, function () {
            rl.close();
            resolve();
        });
    });
}
exports.pressAnyKeyToContinue = pressAnyKeyToContinue;
//# sourceMappingURL=utils.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pressAnyKeyToContinue = exports.clearConsole = exports.stopSpinner = exports.createSpinner = exports.log = exports.createError = exports.CustomError = void 0;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const readline_1 = __importDefault(require("readline"));
class CustomError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.message = message;
    }
}
exports.CustomError = CustomError;
function createError(code, message) {
    return new CustomError(code, message);
}
exports.createError = createError;
function log(message, type = 'info', spinner) {
    const timestamp = new Date().toISOString();
    switch (type) {
        case 'info':
            console.log(chalk_1.default.blue(`[${timestamp} INFO]: ${message}`));
            break;
        case 'error':
            console.error(chalk_1.default.red(`[${timestamp} ERROR]: ${message}`));
            break;
        case 'warning':
            console.warn(chalk_1.default.yellow(`[${timestamp} WARNING]: ${message}`));
            break;
        case 'success':
            console.log(chalk_1.default.green(`[${timestamp} SUCCESS]: ${message}`));
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
    return (0, ora_1.default)({ text, color: 'blue' }).start();
}
exports.createSpinner = createSpinner;
function stopSpinner(spinner, text, type) {
    if (type === 'success') {
        spinner.succeed(chalk_1.default.green(text));
    }
    else if (type === 'fail') {
        spinner.fail(chalk_1.default.red(text));
    }
    else {
        spinner.info(chalk_1.default.blue(text));
    }
}
exports.stopSpinner = stopSpinner;
function clearConsole() {
    process.stdout.write('\x1Bc');
}
exports.clearConsole = clearConsole;
function pressAnyKeyToContinue(prompt = 'Press any key to continue...') {
    return new Promise(resolve => {
        const rl = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(prompt, () => {
            rl.close();
            resolve();
        });
    });
}
exports.pressAnyKeyToContinue = pressAnyKeyToContinue;
//# sourceMappingURL=utils.js.map
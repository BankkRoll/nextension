"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = exports.pressAnyKeyToContinue = exports.clearConsole = exports.stopSpinner = exports.createSpinner = exports.log = exports.createError = exports.CustomError = void 0;
let kleur;
let cliSpinners;
const readline_1 = __importDefault(require("readline"));
let verbose = false;
function initialize(options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        verbose = (_a = options.verbose) !== null && _a !== void 0 ? _a : false;
        const importPromises = [
            Promise.resolve().then(() => __importStar(require('kleur'))).then((kleurModule) => kleur = kleurModule),
            Promise.resolve().then(() => __importStar(require('cli-spinners'))).then((cliSpinnersModule) => cliSpinners = cliSpinnersModule),
        ];
        try {
            yield Promise.all(importPromises);
        }
        catch (error) {
            console.error('Failed to import modules:', error);
        }
    });
}
exports.initialize = initialize;
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
let frameIndex = 0;
function log(message, type = 'info', spinner) {
    if (!verbose && type === 'info') {
        return;
    }
    const timestamp = new Date().toLocaleTimeString();
    const largeSpinnerFrame = cliSpinners.dots.frames[frameIndex] + ' ' + cliSpinners.dots.frames[frameIndex] + ' ' + cliSpinners.dots.frames[frameIndex];
    switch (type) {
        case 'info':
            console.log(kleur.blue(`[${timestamp} INFO]: ${message}`));
            break;
        case 'error':
            console.error(kleur.red(`[${timestamp} ERROR]: ${message}`));
            break;
        case 'warning':
            console.warn(kleur.yellow(`[${timestamp} WARNING]: ${message}`));
            break;
        case 'success':
            console.log(kleur.green(`[${timestamp} SUCCESS]: ${message}`));
            break;
        case 'highlight':
            console.log(kleur.magenta().bold(`[${timestamp} LOG]: ${message}`));
            break;
        case 'spinner':
            process.stdout.write(`\r${kleur.cyan().bold(message)} ${largeSpinnerFrame}`);
            frameIndex = (frameIndex + 1) % cliSpinners.dots.frames.length;
            break;
    }
}
exports.log = log;
function createSpinner(text) {
    return setInterval(() => {
        log(kleur.magenta().bold(text), 'spinner');
    }, cliSpinners.dots.interval);
}
exports.createSpinner = createSpinner;
function stopSpinner(spinner) {
    clearInterval(spinner);
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
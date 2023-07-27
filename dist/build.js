"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
var fs = __importStar(require("fs-extra"));
var glob = __importStar(require("glob"));
var path = __importStar(require("path"));
var child_process_1 = require("child_process");
var js_beautify_1 = require("js-beautify");
var inquirer_1 = __importDefault(require("inquirer"));
var utils_1 = require("./utils");
function executeCommand(command) {
    return __awaiter(this, void 0, void 0, function () {
        var spinner;
        return __generator(this, function (_a) {
            spinner = (0, utils_1.createSpinner)("Running command: ".concat(command));
            return [2, new Promise(function (resolve, reject) {
                    (0, child_process_1.exec)(command, function (error, stdout, stderr) {
                        if (error) {
                            (0, utils_1.log)("Error during command execution '".concat(command, "': ").concat(error), 'error', spinner);
                            reject((0, utils_1.createError)('CMD_EXEC_ERROR', "Error during command execution '".concat(command, "': ").concat(error)));
                        }
                        else if (stderr) {
                            (0, utils_1.log)("stderr during command execution '".concat(command, "': ").concat(stderr), 'error', spinner);
                            reject((0, utils_1.createError)('CMD_EXEC_STDERR', "stderr during command execution '".concat(command, "': ").concat(stderr)));
                        }
                        else {
                            (0, utils_1.stopSpinner)(spinner, "Finished running command: ".concat(command), 'success');
                            resolve(stdout);
                        }
                    });
                })];
        });
    });
}
function runNextBuildAndExport() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    (0, utils_1.log)('Running `next build`...', 'info');
                    return [4, executeCommand('next build')];
                case 1:
                    _a.sent();
                    (0, utils_1.log)('Running `next export`...', 'info');
                    return [4, executeCommand('next export -o nextension')];
                case 2:
                    _a.sent();
                    return [3, 4];
                case 3:
                    error_1 = _a.sent();
                    (0, utils_1.log)('Error during Next.js build/export:', 'error');
                    throw error_1;
                case 4: return [2];
            }
        });
    });
}
function renameNextDirectory() {
    return __awaiter(this, void 0, void 0, function () {
        var oldPath, newPath, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    oldPath = path.resolve('nextension', '_next');
                    newPath = path.resolve('nextension', 'next');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, fs.rename(oldPath, newPath)];
                case 2:
                    _a.sent();
                    (0, utils_1.log)("Successfully renamed directory from ".concat(oldPath, " to ").concat(newPath), 'success');
                    return [3, 4];
                case 3:
                    error_2 = _a.sent();
                    (0, utils_1.log)("Error renaming directory from ".concat(oldPath, " to ").concat(newPath, ":"), 'error');
                    throw error_2;
                case 4: return [2];
            }
        });
    });
}
function formatHTML(html) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, (0, js_beautify_1.html)(html, {
                    indent_size: 2,
                    wrap_line_length: 120,
                    end_with_newline: true,
                    indent_inner_html: true,
                    preserve_newlines: true,
                    wrap_attributes_indent_size: 2,
                    extra_liners: [],
                    content_unformatted: ['pre', 'code'],
                    unformatted: [],
                    indent_handlebars: true,
                    indent_scripts: 'keep',
                    max_preserve_newlines: 1,
                    indent_with_tabs: false,
                })];
        });
    });
}
function updateHtmlFiles() {
    return __awaiter(this, void 0, void 0, function () {
        var htmlFiles, _i, htmlFiles_1, file, content, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    htmlFiles = glob.sync('nextension/**/*.html');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    _i = 0, htmlFiles_1 = htmlFiles;
                    _a.label = 2;
                case 2:
                    if (!(_i < htmlFiles_1.length)) return [3, 7];
                    file = htmlFiles_1[_i];
                    return [4, fs.readFile(file, 'utf8')];
                case 3:
                    content = _a.sent();
                    content = content.replace(/\/_next\//g, '/next/');
                    return [4, formatHTML(content)];
                case 4:
                    content = _a.sent();
                    return [4, fs.writeFile(file, content, 'utf8')];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3, 2];
                case 7:
                    (0, utils_1.log)('Successfully updated HTML files', 'success');
                    return [3, 9];
                case 8:
                    error_3 = _a.sent();
                    (0, utils_1.log)('Error updating HTML files:', 'error');
                    throw error_3;
                case 9: return [2];
            }
        });
    });
}
function copyAssets() {
    return __awaiter(this, void 0, void 0, function () {
        var srcPath, destPath, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    srcPath = path.resolve('assets');
                    destPath = path.resolve('nextension', 'assets');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, fs.copy(srcPath, destPath)];
                case 2:
                    _a.sent();
                    (0, utils_1.log)('Successfully copied assets', 'success');
                    return [3, 4];
                case 3:
                    error_4 = _a.sent();
                    (0, utils_1.log)("Error copying assets from ".concat(srcPath, " to ").concat(destPath, ":"), 'error');
                    throw error_4;
                case 4: return [2];
            }
        });
    });
}
function checkManifest() {
    return __awaiter(this, void 0, void 0, function () {
        var manifestPath, manifestExists, generate, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    manifestPath = path.resolve('nextension', 'assets', 'manifest.json');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4, fs.pathExists(manifestPath)];
                case 2:
                    manifestExists = _a.sent();
                    if (!!manifestExists) return [3, 5];
                    return [4, inquirer_1.default.prompt([
                            {
                                type: 'confirm',
                                name: 'generate',
                                message: 'manifest.json not found. Would you like to generate a template?',
                                default: false
                            }
                        ])];
                case 3:
                    generate = (_a.sent()).generate;
                    if (!generate) return [3, 5];
                    return [4, generateManifest()];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [3, 7];
                case 6:
                    error_5 = _a.sent();
                    (0, utils_1.log)('Successfully checked manifest.json', 'success');
                    throw error_5;
                case 7: return [2];
            }
        });
    });
}
function generateManifest() {
    return __awaiter(this, void 0, void 0, function () {
        var assetsDir, defaultPopupExists, contentScriptExists, backgroundScriptExists, iconsExist, questions, answers, manifestContent, manifestPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assetsDir = path.resolve('public');
                    return [4, fs.pathExists(path.join(assetsDir, 'popup.html'))];
                case 1:
                    defaultPopupExists = _a.sent();
                    return [4, fs.pathExists(path.join(assetsDir, 'content.js'))];
                case 2:
                    contentScriptExists = _a.sent();
                    return [4, fs.pathExists(path.join(assetsDir, 'background.js'))];
                case 3:
                    backgroundScriptExists = _a.sent();
                    return [4, fs.pathExists(path.join(assetsDir, 'icons'))];
                case 4:
                    iconsExist = _a.sent();
                    questions = [
                        {
                            type: 'input',
                            name: 'name',
                            message: 'Extension name:',
                            default: 'My Extension',
                        },
                        {
                            type: 'input',
                            name: 'version',
                            message: 'Extension version:',
                            default: '1.0',
                        },
                        {
                            type: 'input',
                            name: 'description',
                            message: 'Description:',
                            default: 'My awesome Chrome extension',
                        },
                        {
                            type: 'input',
                            name: 'author',
                            message: 'Author:',
                        },
                        {
                            type: 'input',
                            name: 'homepage_url',
                            message: 'Homepage URL:',
                        },
                    ];
                    return [4, inquirer_1.default.prompt(questions)];
                case 5:
                    answers = _a.sent();
                    manifestContent = __assign(__assign({ manifest_version: 3 }, answers), { action: defaultPopupExists ? { default_popup: 'popup.html' } : undefined, background: backgroundScriptExists ? { service_worker: 'background.js' } : undefined, content_scripts: contentScriptExists ? [{ js: ['content.js'], matches: ['<all_urls>'], all_frames: true }] : undefined, icons: iconsExist ? {
                            '16': 'icons/icon16.png',
                            '48': 'icons/icon48.png',
                            '128': 'icons/icon128.png',
                        } : undefined });
                    manifestPath = path.resolve('nextension', 'assets', 'manifest.json');
                    return [4, fs.writeJson(manifestPath, manifestContent, { spaces: 2 })];
                case 6:
                    _a.sent();
                    (0, utils_1.log)('Successfully generated manifest.json', 'success');
                    return [2];
            }
        });
    });
}
function build() {
    return __awaiter(this, void 0, void 0, function () {
        var error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4, runNextBuildAndExport()];
                case 1:
                    _a.sent();
                    return [4, renameNextDirectory()];
                case 2:
                    _a.sent();
                    return [4, updateHtmlFiles()];
                case 3:
                    _a.sent();
                    return [4, copyAssets()];
                case 4:
                    _a.sent();
                    return [4, checkManifest()];
                case 5:
                    _a.sent();
                    (0, utils_1.log)('Build completed successfully', 'success');
                    return [3, 7];
                case 6:
                    error_6 = _a.sent();
                    (0, utils_1.log)('An error occurred during the build process:', 'error');
                    process.exit(1);
                    return [3, 7];
                case 7: return [2];
            }
        });
    });
}
exports.build = build;
process.on('unhandledRejection', function (reason, promise) {
    (0, utils_1.log)("Unhandled Rejection at: ".concat(promise, ", reason: ").concat(reason), 'error');
    process.exit(1);
});
//# sourceMappingURL=build.js.map
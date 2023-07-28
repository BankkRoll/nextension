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
exports.build = void 0;
const fs = __importStar(require("fs-extra"));
const glob = __importStar(require("glob"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const js_beautify_1 = require("js-beautify");
const inquirer_1 = __importDefault(require("inquirer"));
const utils_1 = require("./utils");
function executeCommand(command) {
    return __awaiter(this, void 0, void 0, function* () {
        const yarnLockExists = yield fs.pathExists('yarn.lock');
        const pnpmLockExists = yield fs.pathExists('pnpm-lock.yaml');
        let packageManagerCommand = 'npm run';
        if (yarnLockExists) {
            packageManagerCommand = 'yarn';
        }
        else if (pnpmLockExists) {
            packageManagerCommand = 'pnpm';
        }
        const fullCommand = `${packageManagerCommand} ${command}`;
        const spinner = (0, utils_1.createSpinner)(`Initiating protocol: ${fullCommand}`);
        return new Promise((resolve, reject) => {
            (0, child_process_1.exec)(fullCommand, { timeout: 60000 }, (error, stdout, stderr) => {
                if (error) {
                    (0, utils_1.log)(`Error during command execution '${fullCommand}': ${error}`, 'error', spinner);
                    (0, utils_1.log)(`stdout: ${stdout}`, 'info', spinner);
                    (0, utils_1.log)(`stderr: ${stderr}`, 'info', spinner);
                    (0, utils_1.log)(`Error code: ${error.code}`, 'info', spinner);
                    (0, utils_1.log)(`Error signal: ${error.signal}`, 'info', spinner);
                    (0, utils_1.log)(`Error message: ${error.message}`, 'info', spinner);
                    reject((0, utils_1.createError)('CMD_EXEC_ERROR', `Error during command execution '${fullCommand}': ${error}`));
                }
                else if (stderr) {
                    (0, utils_1.log)(`stderr during command execution '${fullCommand}': ${stderr}`, 'error', spinner);
                    reject((0, utils_1.createError)('CMD_EXEC_STDERR', `stderr during command execution '${fullCommand}': ${stderr}`));
                }
                else {
                    (0, utils_1.stopSpinner)(spinner);
                    resolve(stdout);
                }
            });
        });
    });
}
function ensureScriptsInPackageJson() {
    return __awaiter(this, void 0, void 0, function* () {
        const packageJsonPath = path.resolve('package.json');
        const packageJson = yield fs.readJson(packageJsonPath);
        if (!packageJson.scripts) {
            packageJson.scripts = {};
        }
        if (!packageJson.scripts.build) {
            packageJson.scripts.build = 'next build';
            (0, utils_1.log)('Adding `build` script to package.json', 'highlight');
        }
        if (!packageJson.scripts.export) {
            packageJson.scripts.export = 'next export';
            (0, utils_1.log)('Adding `export` script to package.json', 'highlight');
        }
        yield fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    });
}
function runNextBuildAndExport() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, utils_1.log)('Running `next build`...', 'info');
            yield executeCommand('build');
            const outPath = path.join(process.cwd(), 'out');
            const exists = yield fs.pathExists(outPath);
            (0, utils_1.log)(`\nout directory exists: ${exists}`, 'info');
            yield fs.move(outPath, path.join(process.cwd(), 'nextension'));
            (0, utils_1.log)(`Moved 'out' directory to 'nextension'`, 'highlight');
        }
        catch (error) {
            if (error instanceof Error) {
                (0, utils_1.log)('Error during Next.js build/export:', 'error');
                (0, utils_1.log)(`Error stack: ${error.stack}`, 'error');
            }
            else {
                (0, utils_1.log)('Error during Next.js build/export:', 'error');
                (0, utils_1.log)(`Error: ${error}`, 'error');
            }
            throw error;
        }
    });
}
function renameNextDirectory() {
    return __awaiter(this, void 0, void 0, function* () {
        const oldPath = path.resolve(process.cwd(), 'nextension', '_next');
        const newPath = path.resolve(process.cwd(), 'nextension', 'next');
        try {
            yield fs.rename(oldPath, newPath);
            (0, utils_1.log)(`Renamed directory from ${path.basename(oldPath)} to ${path.basename(newPath)}`, 'highlight');
        }
        catch (error) {
            (0, utils_1.log)(`Error renaming directory from ${path.basename(oldPath)} to ${path.basename(newPath)}:`, 'error');
            throw error;
        }
    });
}
function formatHTML(html) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, js_beautify_1.html)(html, {
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
        });
    });
}
function updateHtmlFiles() {
    return __awaiter(this, void 0, void 0, function* () {
        const htmlFiles = glob.sync('nextension/**/*.html');
        try {
            for (const file of htmlFiles) {
                let content = yield fs.readFile(file, 'utf8');
                content = content.replace(/\/_next\//g, '/next/');
                content = yield formatHTML(content);
                yield fs.writeFile(file, content, 'utf8');
            }
            (0, utils_1.log)('Updated HTML files', 'highlight');
        }
        catch (error) {
            (0, utils_1.log)('Error updating HTML files:', 'error');
            throw error;
        }
    });
}
function copyAssets() {
    return __awaiter(this, void 0, void 0, function* () {
        const srcPath = path.resolve('assets');
        const destPath = path.resolve('nextension', 'assets');
        try {
            if (yield fs.pathExists(srcPath)) {
                yield fs.copy(srcPath, destPath);
                (0, utils_1.log)('Copied assets', 'highlight');
            }
            else {
                (0, utils_1.log)('Assets directory does not exist, skipping copy operation', 'info');
            }
        }
        catch (error) {
            (0, utils_1.log)(`Error copying assets from ${srcPath} to ${destPath}:`, 'error');
            throw error;
        }
    });
}
function checkManifest() {
    return __awaiter(this, void 0, void 0, function* () {
        const manifestPath = path.resolve('nextension', 'manifest.json');
        try {
            const manifestExists = yield fs.pathExists(manifestPath);
            if (!manifestExists) {
                const { generate } = yield inquirer_1.default.prompt([
                    {
                        type: 'confirm',
                        name: 'generate',
                        message: 'manifest.json not found. Would you like to generate a template?',
                        default: false
                    }
                ]);
                if (generate) {
                    yield generateManifest();
                }
            }
        }
        catch (error) {
            (0, utils_1.log)('Error checking manifest.json', 'error');
            throw error;
        }
    });
}
function generateManifest() {
    return __awaiter(this, void 0, void 0, function* () {
        const assetsDir = path.resolve('public');
        const defaultPopupExists = yield fs.pathExists(path.join(assetsDir, 'popup.html'));
        const contentScriptExists = yield fs.pathExists(path.join(assetsDir, 'content.js'));
        const backgroundScriptExists = yield fs.pathExists(path.join(assetsDir, 'background.js'));
        const iconsExist = yield fs.pathExists(path.join(assetsDir, 'icons'));
        const questions = [
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
        const answers = yield inquirer_1.default.prompt(questions);
        const manifestContent = Object.assign(Object.assign({ manifest_version: 3 }, answers), { action: defaultPopupExists ? { default_popup: 'popup.html' } : undefined, background: backgroundScriptExists ? { service_worker: 'background.js' } : undefined, content_scripts: contentScriptExists ? [{ js: ['content.js'], matches: ['<all_urls>'], all_frames: true }] : undefined, icons: iconsExist ? {
                '16': 'icons/icon16.png',
                '48': 'icons/icon48.png',
                '128': 'icons/icon128.png',
            } : undefined });
        const manifestPath = path.resolve('nextension', 'assets', 'manifest.json');
        yield fs.writeJson(manifestPath, manifestContent, { spaces: 2 });
        (0, utils_1.log)('Generated manifest.json', 'highlight');
    });
}
function organizeFiles() {
    return __awaiter(this, void 0, void 0, function* () {
        const nextensionPath = path.resolve(process.cwd(), 'nextension');
        const directories = {
            '.js': 'scripts',
            '.css': 'styles',
            '.png': 'icons',
            '.jpg': 'icons',
            '.ico': 'icons',
            '.svg': 'icons',
            '.html': 'html'
        };
        for (const dir of Object.values(directories)) {
            yield fs.mkdir(path.join(nextensionPath, dir), { recursive: true });
        }
        for (const [ext, dir] of Object.entries(directories)) {
            const files = glob.sync(path.join(nextensionPath, `*${ext}`));
            for (const file of files) {
                if (path.basename(file).startsWith('popup')) {
                    yield fs.move(file, path.join(nextensionPath, 'popup', path.basename(file)));
                }
                else {
                    yield fs.move(file, path.join(nextensionPath, dir, path.basename(file)));
                }
            }
        }
        (0, utils_1.log)('Organized files', 'highlight');
    });
}
function build() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, utils_1.initialize)();
            (0, utils_1.log)('Initiating build process...', 'highlight');
            yield ensureScriptsInPackageJson();
            (0, utils_1.log)('\u2714 Validated presence of required scripts in package.json', 'success');
            yield runNextBuildAndExport();
            (0, utils_1.log)('\u2714 Next.js build and export process completed', 'success');
            yield renameNextDirectory();
            (0, utils_1.log)('\u2714 Renamed _next directory to next for compatibility', 'success');
            yield updateHtmlFiles();
            (0, utils_1.log)('\u2714 HTML files have been updated to reference new directory structure', 'success');
            yield copyAssets();
            (0, utils_1.log)('\u2714 Assets have been copied to the target directory', 'success');
            yield checkManifest();
            (0, utils_1.log)('\u2714 Manifest.json file checked, and generated if not present', 'success');
            yield organizeFiles();
            (0, utils_1.log)('\u2714 Files organized into a cleaner directory structure', 'success');
            (0, utils_1.log)('\u2714 Build process completed successfully', 'success');
        }
        catch (error) {
            (0, utils_1.log)('An error occurred during the build process:', 'error');
            process.exit(1);
        }
    });
}
exports.build = build;
process.on('unhandledRejection', (reason, promise) => {
    (0, utils_1.log)(`Unhandled Rejection at: ${promise}, reason: ${reason}`, 'error');
    process.exit(1);
});
//# sourceMappingURL=build.js.map
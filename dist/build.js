"use strict";
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
const fs_extra_1 = __importDefault(require("fs-extra"));
const glob_1 = __importDefault(require("glob"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const js_beautify_1 = require("js-beautify");
const inquirer_1 = __importDefault(require("inquirer"));
const utils_1 = require("./utils");
function executeCommand(command) {
    return __awaiter(this, void 0, void 0, function* () {
        const yarnLockExists = yield fs_extra_1.default.pathExists('yarn.lock');
        const pnpmLockExists = yield fs_extra_1.default.pathExists('pnpm-lock.yaml');
        let packageManagerCommand = 'npm run';
        if (yarnLockExists && pnpmLockExists) {
            const { chosenPackageManager } = yield inquirer_1.default.prompt([
                {
                    type: 'list',
                    name: 'chosenPackageManager',
                    message: 'Both yarn.lock and pnpm-lock.yaml detected, please choose your package manager:',
                    choices: ['npm', 'yarn', 'pnpm'],
                    default: 'npm'
                }
            ]);
            packageManagerCommand = chosenPackageManager;
        }
        else if (yarnLockExists) {
            packageManagerCommand = 'yarn';
        }
        else if (pnpmLockExists) {
            packageManagerCommand = 'pnpm';
        }
        const fullCommand = `${packageManagerCommand} ${command}`;
        const spinner = (0, utils_1.createSpinner)(`Initiating protocol: ${fullCommand}`);
        return new Promise((resolve, reject) => {
            (0, child_process_1.exec)(fullCommand, { timeout: 60000 }, (error, stdout, stderr) => {
                (0, utils_1.stopSpinner)(spinner);
                if (error) {
                    reject((0, utils_1.createError)('CMD_EXEC_ERROR', `Error during command execution '${fullCommand}': ${error}`));
                }
                else if (stderr) {
                    reject((0, utils_1.createError)('CMD_EXEC_STDERR', `stderr during command execution '${fullCommand}': ${stderr}`));
                }
                else {
                    resolve(stdout);
                }
            });
        });
    });
}
function ensureScriptsInPackageJson() {
    return __awaiter(this, void 0, void 0, function* () {
        const packageJsonPath = path_1.default.resolve('package.json');
        const packageJson = yield fs_extra_1.default.readJson(packageJsonPath);
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
        yield fs_extra_1.default.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    });
}
function runNextBuildAndExport() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, utils_1.log)('Running `next build`...', 'info');
            yield executeCommand('build');
            const outPath = path_1.default.join(process.cwd(), 'out');
            const exists = yield fs_extra_1.default.pathExists(outPath);
            (0, utils_1.log)(`\nout directory exists: ${exists}`, 'info');
            yield fs_extra_1.default.move(outPath, path_1.default.join(process.cwd(), 'nextension'));
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
        const oldPath = path_1.default.resolve(process.cwd(), 'nextension', '_next');
        const newPath = path_1.default.resolve(process.cwd(), 'nextension', 'next');
        try {
            yield fs_extra_1.default.rename(oldPath, newPath);
            (0, utils_1.log)(`Renamed directory from ${path_1.default.basename(oldPath)} to ${path_1.default.basename(newPath)}`, 'highlight');
        }
        catch (error) {
            (0, utils_1.log)(`Error renaming directory from ${path_1.default.basename(oldPath)} to ${path_1.default.basename(newPath)}:`, 'error');
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
        const htmlFiles = glob_1.default.sync('nextension/**/*.html');
        try {
            for (const file of htmlFiles) {
                let content = yield fs_extra_1.default.readFile(file, 'utf8');
                content = content.replace(/\/_next\//g, '/next/');
                content = yield formatHTML(content);
                yield fs_extra_1.default.writeFile(file, content, 'utf8');
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
        const srcPath = path_1.default.resolve('assets');
        const destPath = path_1.default.resolve('nextension', 'assets');
        try {
            if (yield fs_extra_1.default.pathExists(srcPath)) {
                yield fs_extra_1.default.copy(srcPath, destPath);
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
function checkManifest(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const manifestPath = path_1.default.resolve('nextension', 'manifest.json');
        try {
            const manifestExists = yield fs_extra_1.default.pathExists(manifestPath);
            if (!manifestExists && options.generateManifest) {
                yield generateManifest();
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
        const assetsDir = path_1.default.resolve('public');
        const defaultPopupExists = yield fs_extra_1.default.pathExists(path_1.default.join(assetsDir, 'popup.html'));
        const contentScriptExists = yield fs_extra_1.default.pathExists(path_1.default.join(assetsDir, 'content.js'));
        const backgroundScriptExists = yield fs_extra_1.default.pathExists(path_1.default.join(assetsDir, 'background.js'));
        const iconsExist = yield fs_extra_1.default.pathExists(path_1.default.join(assetsDir, 'icons'));
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
        const manifestPath = path_1.default.resolve('nextension', 'assets', 'manifest.json');
        yield fs_extra_1.default.writeJson(manifestPath, manifestContent, { spaces: 2 });
        (0, utils_1.log)('Generated manifest.json', 'highlight');
    });
}
function organizeFiles() {
    return __awaiter(this, void 0, void 0, function* () {
        const nextensionPath = path_1.default.resolve(process.cwd(), 'nextension');
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
            yield fs_extra_1.default.mkdir(path_1.default.join(nextensionPath, dir), { recursive: true });
        }
        for (const [ext, dir] of Object.entries(directories)) {
            const files = glob_1.default.sync(path_1.default.join(nextensionPath, `*${ext}`));
            for (const file of files) {
                if (path_1.default.basename(file).startsWith('popup')) {
                    yield fs_extra_1.default.move(file, path_1.default.join(nextensionPath, 'popup', path_1.default.basename(file)));
                }
                else {
                    yield fs_extra_1.default.move(file, path_1.default.join(nextensionPath, dir, path_1.default.basename(file)));
                }
            }
        }
        (0, utils_1.log)('Organized files', 'highlight');
    });
}
function generateBackgroundScript() {
    return __awaiter(this, void 0, void 0, function* () {
        const scriptContent = `
        // Background Service Worker
        self.addEventListener('install', function(event) {
            console.log('[Service Worker] Installing Service Worker ...', event);
        });

        self.addEventListener('activate', function(event) {
            console.log('[Service Worker] Activating Service Worker ...', event);
            return self.clients.claim();
        });

        self.addEventListener('fetch', function(event) {
            console.log('[Service Worker] Fetching something ...', event);
            event.respondWith(fetch(event.request));
        });
    `;
        const scriptPath = path_1.default.resolve('nextension', 'background.js');
        yield fs_extra_1.default.writeFile(scriptPath, scriptContent, 'utf8');
    });
}
function generateContentScript() {
    return __awaiter(this, void 0, void 0, function* () {
        const scriptContent = `
        // Content Script
        console.log('Content script has loaded via Nextension.');
    `;
        const scriptPath = path_1.default.resolve('nextension', 'content.js');
        yield fs_extra_1.default.writeFile(scriptPath, scriptContent, 'utf8');
    });
}
function generatePopupScript() {
    return __awaiter(this, void 0, void 0, function* () {
        const scriptContent = `
        // Popup Script
        console.log('Popup script has loaded via Nextension.');
    `;
        const scriptPath = path_1.default.resolve('nextension', 'popup.js');
        yield fs_extra_1.default.writeFile(scriptPath, scriptContent, 'utf8');
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Nextension Popup</title>
            <script src="popup.js"></script>
        </head>
        <body>
            <h1>Nextension Popup</h1>
        </body>
        </html>
    `;
        const htmlPath = path_1.default.resolve('nextension', 'popup.html');
        yield fs_extra_1.default.writeFile(htmlPath, htmlContent, 'utf8');
    });
}
function generateOptionsScript() {
    return __awaiter(this, void 0, void 0, function* () {
        const scriptContent = `
        // Options Script
        console.log('Options script has loaded via Nextension.');
    `;
        const scriptPath = path_1.default.resolve('nextension', 'options.js');
        yield fs_extra_1.default.writeFile(scriptPath, scriptContent, 'utf8');
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Nextension Options</title>
            <script src="options.js"></script>
        </head>
        <body>
            <h1>Nextension Options</h1>
        </body>
        </html>
    `;
        const htmlPath = path_1.default.resolve('nextension', 'options.html');
        yield fs_extra_1.default.writeFile(htmlPath, htmlContent, 'utf8');
    });
}
function generateActionScript() {
    return __awaiter(this, void 0, void 0, function* () {
        const scriptContent = `
        // Action Script
        console.log('Action script has loaded via Nextension.');
    `;
        const scriptPath = path_1.default.resolve('nextension', 'action.js');
        yield fs_extra_1.default.writeFile(scriptPath, scriptContent, 'utf8');
    });
}
function build(options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, utils_1.initialize)(options);
            (0, utils_1.log)('Initiating build process...', 'highlight');
            yield ensureScriptsInPackageJson();
            (0, utils_1.log)('\u2714 Validated presence of required scripts in package.json', 'success');
            yield runNextBuildAndExport();
            (0, utils_1.log)('\u2714 Next.js build and export process completed', 'success');
            yield renameNextDirectory();
            (0, utils_1.log)('\u2714 Renamed _next directory to next for compatibility', 'success');
            yield updateHtmlFiles();
            (0, utils_1.log)('\u2714 HTML files have been updated to reference new directory structure', 'success');
            if (options.generateManifest || options.generateBackground || options.generateContent || options.generatePopup || options.generateOptions || options.generateAction) {
                yield copyAssets();
                (0, utils_1.log)('\u2714 Assets have been copied to the target directory', 'success');
            }
            if (options.generateBackground) {
                yield generateBackgroundScript();
                (0, utils_1.log)('\u2714 Generated background script file', 'success');
            }
            if (options.generateContent) {
                yield generateContentScript();
                (0, utils_1.log)('\u2714 Generated content script file', 'success');
            }
            if (options.generatePopup) {
                yield generatePopupScript();
                (0, utils_1.log)('\u2714 Generated popup script file', 'success');
            }
            if (options.generateOptions) {
                yield generateOptionsScript();
                (0, utils_1.log)('\u2714 Generated options script file', 'success');
            }
            if (options.generateAction) {
                yield generateActionScript();
                (0, utils_1.log)('\u2714 Generated action script file', 'success');
            }
            if (options.generateManifest) {
                yield checkManifest(options);
                (0, utils_1.log)('\u2714 Manifest.json file checked, and generated if not present', 'success');
            }
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
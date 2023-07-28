import fs from 'fs-extra';
import glob from 'glob';
import path from 'path';
import { exec } from 'child_process';
import { html as beautifyHTML } from 'js-beautify';
import inquirer from 'inquirer';

import { 
  log,
  createSpinner,
  stopSpinner,
  createError,
  initialize 
} from './utils';

interface BuildOptions {
    verbose?: boolean;
    generateManifest?: boolean;
    generateBackground?: boolean;
    generateContent?: boolean;
    generatePopup?: boolean;
    generateOptions?: boolean;
    generateAction?: boolean;
}

/**
 * Executes a command in the package.json file and returns the output.
 * Now checking for both yarn.lock and pnpm-lock.yaml, if both exist, user is prompted to choose.
 */
async function executeCommand(command: string) {
    const yarnLockExists = await fs.pathExists('yarn.lock');
    const pnpmLockExists = await fs.pathExists('pnpm-lock.yaml');
    let packageManagerCommand = 'npm run';

    if (yarnLockExists && pnpmLockExists) {
        const { chosenPackageManager } = await inquirer.prompt([
            {
                type: 'list',
                name: 'chosenPackageManager',
                message: 'Both yarn.lock and pnpm-lock.yaml detected, please choose your package manager:',
                choices: ['npm', 'yarn', 'pnpm'],
                default: 'npm'
            }
        ]);
        packageManagerCommand = chosenPackageManager;
    } else if (yarnLockExists) {
        packageManagerCommand = 'yarn';
    } else if (pnpmLockExists) {
        packageManagerCommand = 'pnpm';
    }

    const fullCommand = `${packageManagerCommand} ${command}`;
    const spinner = createSpinner(`Initiating protocol: ${fullCommand}`);
    return new Promise((resolve, reject) => {
        exec(fullCommand, {timeout: 60000}, (error, stdout, stderr) => {
            stopSpinner(spinner);
            if (error) {
                reject(createError('CMD_EXEC_ERROR', `Error during command execution '${fullCommand}': ${error}`));
            } else if (stderr) {
                reject(createError('CMD_EXEC_STDERR', `stderr during command execution '${fullCommand}': ${stderr}`));
            } else {
                resolve(stdout);
            }
        });
    });
}


/**
 * Creates a build and export script in the package.json file.
 */
async function ensureScriptsInPackageJson() {
    const packageJsonPath = path.resolve('package.json');
    const packageJson = await fs.readJson(packageJsonPath);

    if (!packageJson.scripts) {
        packageJson.scripts = {};
    }

    if (!packageJson.scripts.build) {
        packageJson.scripts.build = 'next build';
        log('Adding `build` script to package.json', 'highlight');
    }

    if (!packageJson.scripts.export) {
        packageJson.scripts.export = 'next export';
        log('Adding `export` script to package.json', 'highlight');
    }

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

/**
 * Runs the 'next build' and 'next export' commands.
 */
async function runNextBuildAndExport() {
    try {
        log('Running `next build`...', 'info');
        await executeCommand('build');

        const outPath = path.join(process.cwd(), 'out');
        const exists = await fs.pathExists(outPath);
        log(`\nout directory exists: ${exists}`, 'info');

        // Move or rename the 'out' directory to 'nextension' after the build is complete
        await fs.move(outPath, path.join(process.cwd(), 'nextension'));
        log(`Moved 'out' directory to 'nextension'`, 'highlight');
    } catch (error) {
        if (error instanceof Error) {
            log('Error during Next.js build/export:', 'error');
            log(`Error stack: ${error.stack}`, 'error');
        } else {
            log('Error during Next.js build/export:', 'error');
            log(`Error: ${error}`, 'error');
        }
        throw error;
    }
}

/**
 * Renames the _next directory to next.
 */
async function renameNextDirectory() {
    const oldPath = path.resolve(process.cwd(), 'nextension', '_next');
    const newPath = path.resolve(process.cwd(), 'nextension', 'next');

    try {
        await fs.rename(oldPath, newPath);
        log(`Renamed directory from ${path.basename(oldPath)} to ${path.basename(newPath)}`, 'highlight');
    } catch (error) {
        log(`Error renaming directory from ${path.basename(oldPath)} to ${path.basename(newPath)}:`, 'error');
        throw error;
    }
}

/**
 * Formats HTML code with js-beautify.
 * @param html {string}
 * @return {Promise<string>}
 */
async function formatHTML(html: string): Promise<string> {
    return beautifyHTML(html, {
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
}

/**
 * Updates HTML files in the nextension directory.
 * Replaces /_next/ with /next/ and formats the HTML.
 */
async function updateHtmlFiles() {
    const htmlFiles = glob.sync('nextension/**/*.html');

    try {
        for (const file of htmlFiles) {
            let content = await fs.readFile(file, 'utf8');
            content = content.replace(/\/_next\//g, '/next/');
            content = await formatHTML(content);
            await fs.writeFile(file, content, 'utf8');
        }
        log('Updated HTML files', 'highlight');
    } catch (error) {
        log('Error updating HTML files:', 'error');
        throw error;
    }
}

/**
 * Copy the assets directory to the output directory.
 */
async function copyAssets() {
    const srcPath = path.resolve('assets');
    const destPath = path.resolve('nextension', 'assets');

    try {
        // Check if the assets directory exists
        if (await fs.pathExists(srcPath)) {
            await fs.copy(srcPath, destPath);
            log('Copied assets', 'highlight');
        } else {
            log('Assets directory does not exist, skipping copy operation', 'info');
        }
    } catch (error) {
        log(`Error copying assets from ${srcPath} to ${destPath}:`, 'error');
        throw error;
    }
}

/**
 * Checks for the presence of manifest.json in the assets directory.
 * If not present, prompts the user to generate a template.
 */
async function checkManifest(options: BuildOptions) {
    const manifestPath = path.resolve('nextension', 'manifest.json');

    try {
        const manifestExists = await fs.pathExists(manifestPath);

        if (!manifestExists && options.generateManifest) {
            await generateManifest();
        }
    } catch (error) {
        log('Error checking manifest.json', 'error');
        throw error;
    }
}

/**
 * Generates the manifest.json file if it does not exist.
 */
async function generateManifest() {
    const assetsDir = path.resolve('public');
    const defaultPopupExists = await fs.pathExists(path.join(assetsDir, 'popup.html'));
    const contentScriptExists = await fs.pathExists(path.join(assetsDir, 'content.js'));
    const backgroundScriptExists = await fs.pathExists(path.join(assetsDir, 'background.js'));
    const iconsExist = await fs.pathExists(path.join(assetsDir, 'icons'));

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

    const answers = await inquirer.prompt(questions);

    const manifestContent = {
        manifest_version: 3,
        ...answers,
        action: defaultPopupExists ? { default_popup: 'popup.html' } : undefined,
        background: backgroundScriptExists ? { service_worker: 'background.js' } : undefined,
        content_scripts: contentScriptExists ? [{ js: ['content.js'], matches: ['<all_urls>'], all_frames: true }] : undefined,
        icons: iconsExist ? {
            '16': 'icons/icon16.png',
            '48': 'icons/icon48.png',
            '128': 'icons/icon128.png',
        } : undefined,
    };

    const manifestPath = path.resolve('nextension', 'assets', 'manifest.json');

    await fs.writeJson(manifestPath, manifestContent, { spaces: 2 });
    log('Generated manifest.json', 'highlight');
}

/**
 * Organizes files into a clean directory structure.
 */
async function organizeFiles() {
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
        await fs.mkdir(path.join(nextensionPath, dir), { recursive: true });
    }

    // Move files to appropriate directories
    for (const [ext, dir] of Object.entries(directories)) {
        const files = glob.sync(path.join(nextensionPath, `*${ext}`));
        for (const file of files) {
            // Special handling for popup related files
            if (path.basename(file).startsWith('popup')) {
                await fs.move(file, path.join(nextensionPath, 'popup', path.basename(file)));
            } else {
                await fs.move(file, path.join(nextensionPath, dir, path.basename(file)));
            }
        }
    }
    log('Organized files', 'highlight');
}

/**
 * Generate a background service worker script file.
 */
async function generateBackgroundScript() {
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

    const scriptPath = path.resolve('nextension', 'background.js');
    await fs.writeFile(scriptPath, scriptContent, 'utf8');
}

/**
 * Generate a content script file.
 */
async function generateContentScript() {
    const scriptContent = `
        // Content Script
        console.log('Content script has loaded via Nextension.');
    `;

    const scriptPath = path.resolve('nextension', 'content.js');
    await fs.writeFile(scriptPath, scriptContent, 'utf8');
}

/**
 * Generate a popup script and HTML file.
 */
async function generatePopupScript() {
    const scriptContent = `
        // Popup Script
        console.log('Popup script has loaded via Nextension.');
    `;

    const scriptPath = path.resolve('nextension', 'popup.js');
    await fs.writeFile(scriptPath, scriptContent, 'utf8');

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

    const htmlPath = path.resolve('nextension', 'popup.html');
    await fs.writeFile(htmlPath, htmlContent, 'utf8');
}

/**
 * Generate an options script and HTML file.
 */
async function generateOptionsScript() {
    const scriptContent = `
        // Options Script
        console.log('Options script has loaded via Nextension.');
    `;

    const scriptPath = path.resolve('nextension', 'options.js');
    await fs.writeFile(scriptPath, scriptContent, 'utf8');

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

    const htmlPath = path.resolve('nextension', 'options.html');
    await fs.writeFile(htmlPath, htmlContent, 'utf8');
}

/**
 * Generate an action script file.
 */
async function generateActionScript() {
    const scriptContent = `
        // Action Script
        console.log('Action script has loaded via Nextension.');
    `;

    const scriptPath = path.resolve('nextension', 'action.js');
    await fs.writeFile(scriptPath, scriptContent, 'utf8');
}

/**
 * Main function.
 * Runs the build and export commands, renames the directory, updates HTML files, copies assets, checks for manifest.json, and organizes files.
 */
export async function build(options: BuildOptions) {
    try {
        await initialize(options);
        log('Initiating build process...', 'highlight');
        await ensureScriptsInPackageJson();
        log('\u2714 Validated presence of required scripts in package.json', 'success');
        await runNextBuildAndExport();
        log('\u2714 Next.js build and export process completed', 'success');
        await renameNextDirectory();
        log('\u2714 Renamed _next directory to next for compatibility', 'success');
        await updateHtmlFiles();
        log('\u2714 HTML files have been updated to reference new directory structure', 'success');

        // Only copy assets if a specific build option is enabled
        if (options.generateManifest || options.generateBackground || options.generateContent || options.generatePopup || options.generateOptions || options.generateAction) {
            await copyAssets();
            log('\u2714 Assets have been copied to the target directory', 'success');
        }

        if (options.generateBackground) {
            await generateBackgroundScript();
            log('\u2714 Generated background script file', 'success');
        }

        if (options.generateContent) {
            await generateContentScript();
            log('\u2714 Generated content script file', 'success');
        }

        if (options.generatePopup) {
            await generatePopupScript();
            log('\u2714 Generated popup script file', 'success');
        }

        if (options.generateOptions) {
            await generateOptionsScript();
            log('\u2714 Generated options script file', 'success');
        }

        if (options.generateAction) {
            await generateActionScript();
            log('\u2714 Generated action script file', 'success');
        }

        // Only generate the manifest if the corresponding option is enabled
        if (options.generateManifest) {
            await checkManifest(options);
            log('\u2714 Manifest.json file checked, and generated if not present', 'success');
        }

        await organizeFiles();
        log('\u2714 Files organized into a cleaner directory structure', 'success');
        log('\u2714 Build process completed successfully', 'success');
    } catch (error) {
        log('An error occurred during the build process:', 'error');
        process.exit(1);
    }
}


/**
 * Handles any unhandled promise rejections.
 */
process.on('unhandledRejection', (reason, promise) => {
    log(`Unhandled Rejection at: ${promise}, reason: ${reason}`, 'error');
    process.exit(1);
});
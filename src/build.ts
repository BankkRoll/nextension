import * as fs from 'fs-extra';
import * as glob from 'glob';
import * as path from 'path';
import { exec } from 'child_process';
import { html as beautifyHTML } from 'js-beautify';
import inquirer from 'inquirer';
import { log, createSpinner, stopSpinner, createError, initialize } from './utils';


/**
 * Executes a command in the package.json file and returns the output.
 */
async function executeCommand(command: string) {
    const yarnLockExists = await fs.pathExists('yarn.lock');
    const pnpmLockExists = await fs.pathExists('pnpm-lock.yaml');
    let packageManagerCommand = 'npm run';

    if (yarnLockExists) {
        packageManagerCommand = 'yarn';
    } else if (pnpmLockExists) {
        packageManagerCommand = 'pnpm';
    }

    const fullCommand = `${packageManagerCommand} ${command}`;
    const spinner = createSpinner(`Initiating protocol: ${fullCommand}`);
    return new Promise((resolve, reject) => {
        exec(fullCommand, {timeout: 60000}, (error, stdout, stderr) => {
            if (error) {
                log(`Error during command execution '${fullCommand}': ${error}`, 'error', spinner);
                log(`stdout: ${stdout}`, 'info', spinner);
                log(`stderr: ${stderr}`, 'info', spinner);
                log(`Error code: ${error.code}`, 'info', spinner);
                log(`Error signal: ${error.signal}`, 'info', spinner);
                log(`Error message: ${error.message}`, 'info', spinner);
                reject(createError('CMD_EXEC_ERROR', `Error during command execution '${fullCommand}': ${error}`));
            } else if (stderr) {
                log(`stderr during command execution '${fullCommand}': ${stderr}`, 'error', spinner);
                reject(createError('CMD_EXEC_STDERR', `stderr during command execution '${fullCommand}': ${stderr}`));
            } else {
                stopSpinner(spinner);
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
async function checkManifest() {
    const manifestPath = path.resolve('nextension', 'manifest.json');

    try {
        const manifestExists = await fs.pathExists(manifestPath);

        if (!manifestExists) {
            const { generate } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'generate',
                    message: 'manifest.json not found. Would you like to generate a template?',
                    default: false
                }
            ]);

            if (generate) {
                await generateManifest();
            }
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
 * Main function.
 * Runs the build and export commands, renames the directory, updates HTML files, copies assets, checks for manifest.json, and organizes files.
 */
export async function build() {
    try {
        await initialize();
        log('Initiating build process...', 'highlight');
        await ensureScriptsInPackageJson();
        log('\u2714 Validated presence of required scripts in package.json', 'success');
        await runNextBuildAndExport();
        log('\u2714 Next.js build and export process completed', 'success');
        await renameNextDirectory();
        log('\u2714 Renamed _next directory to next for compatibility', 'success');
        await updateHtmlFiles();
        log('\u2714 HTML files have been updated to reference new directory structure', 'success');
        await copyAssets();
        log('\u2714 Assets have been copied to the target directory', 'success');
        await checkManifest();
        log('\u2714 Manifest.json file checked, and generated if not present', 'success');
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
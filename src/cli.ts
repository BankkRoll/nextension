#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { build } from './build';
import { log, initialize } from './utils';

interface BuildArgs {
    verbose?: boolean;
    generateManifest?: boolean;
    generateBackground?: boolean;
    generateContent?: boolean;
    generatePopup?: boolean;
    generateOptions?: boolean;
    generateAction?: boolean;
}

const boxWidth = 60;
const horizontalLine = '+' + '-'.repeat(boxWidth) + '+';

// Initialize your utilities with verbose option
initialize({ verbose: true });

// Custom help command function
function customHelp() {
    log(horizontalLine, 'highlight');
    log('|' + ' '.repeat(boxWidth) + '|', 'highlight');
    log('|' + 'Nextension Help'.padStart(boxWidth / 2).padEnd(boxWidth) + '|', 'highlight');
    log('|' + ' '.repeat(boxWidth) + '|', 'highlight');
    log('|' + 'build: Build the Next.js application'.padStart(boxWidth - 2).padEnd(boxWidth) + '|', 'highlight');
    log('|' + '-v, --verbose: Run with verbose logging'.padStart(boxWidth - 2).padEnd(boxWidth) + '|', 'highlight');
    log('|' + '-m, --generate-manifest: Prompt to generate a manifest file if not present'.padStart(boxWidth - 2).padEnd(boxWidth) + '|', 'highlight');
    log('|' + '-b, --generate-background: Prompt to generate a background script if not present'.padStart(boxWidth - 2).padEnd(boxWidth) + '|', 'highlight');
    log('|' + '-c, --generate-content: Prompt to generate a content script if not present'.padStart(boxWidth - 2).padEnd(boxWidth) + '|', 'highlight');
    log('|' + '-p, --generate-popup: Prompt to generate a popup script and HTML if not present'.padStart(boxWidth - 2).padEnd(boxWidth) + '|', 'highlight');
    log('|' + '-o, --generate-options: Prompt to generate an options script and HTML if not present'.padStart(boxWidth - 2).padEnd(boxWidth) + '|', 'highlight');
    log('|' + '-a, --generate-action: Prompt to generate an action script if not present'.padStart(boxWidth - 2).padEnd(boxWidth) + '|', 'highlight');
    log('|' + ' '.repeat(boxWidth) + '|', 'highlight');
    log(horizontalLine, 'highlight');
}

// Create the CLI application
yargs(hideBin(process.argv))
    .help(false)
    .version(false)
    .option('help', {
        alias: 'h',
        type: 'boolean',
        description: 'Show help',
        global: false,
        demandOption: false
    })
    .command('help', 'Display help', {}, () => {
        customHelp();
    })
    .command('build', 'Build the Next.js application', (yargs) => {
        return yargs
            .option('verbose', {
                alias: 'v',
                type: 'boolean',
                description: 'Run with verbose logging'
            })
            .option('generate-manifest', {
                alias: 'm',
                type: 'boolean',
                description: 'Prompt to generate a manifest file if not present'
            })
            .option('generate-background', {
                alias: 'b',
                type: 'boolean',
                description: 'Prompt to generate a background script if not present'
            })
            .option('generate-content', {
                alias: 'c',
                type: 'boolean',
                description: 'Prompt to generate a content script if not present'
            })
            .option('generate-popup', {
                alias: 'p',
                type: 'boolean',
                description: 'Prompt to generate a popup script and HTML if not present'
            })
            .option('generate-options', {
                alias: 'o',
                type: 'boolean',
                description: 'Prompt to generate an options script and HTML if not present'
            })
            .option('generate-action', {
                alias: 'a',
                type: 'boolean',
                description: 'Prompt to generate an action script if not present'
            });
    }, (argv) => {
        if (argv.verbose) {
            console.log('Verbose mode is on.');
        }
        const args: BuildArgs = {
            verbose: argv.verbose as boolean,
            generateManifest: argv.generateManifest as boolean,
            generateBackground: argv.generateBackground as boolean,
            generateContent: argv.generateContent as boolean,
            generatePopup: argv.generatePopup as boolean,
            generateOptions: argv.generateOptions as boolean,
            generateAction: argv.generateAction as boolean
        };
        build(args);
    })
    .command('*', 'default', () => {}, (argv) => {
        if (argv.verbose) {
            console.log('Verbose mode is on.');
        }
        const args: BuildArgs = {
            verbose: argv.verbose as boolean,
            generateManifest: argv.generateManifest as boolean,
            generateBackground: argv.generateBackground as boolean,
            generateContent: argv.generateContent as boolean,
            generatePopup: argv.generatePopup as boolean,
            generateOptions: argv.generateOptions as boolean,
            generateAction: argv.generateAction as boolean
        };
        build(args);
    })
    .demandCommand(0, 0)
    .check(argv => {
        if (argv.help) {
            customHelp();
            process.exit(0);
        }
        return true;
    })
    .argv;

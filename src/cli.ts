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

// Initialize your utilities with verbose option
initialize({ verbose: true });

// Custom help command function
function customHelp() {
    const horizontalLine = '+' + '-'.repeat(boxWidth) + '+';
    console.log(horizontalLine);
    console.log('|' + 'Command'.padEnd(20) + '|' + 'Description'.padEnd(boxWidth - 23) + '|');
    console.log('|' + '-'.repeat(20) + '+' + '-'.repeat(boxWidth - 23) + '|');
    console.log('|' + 'build'.padEnd(20) + '|' + 'Build the Next.js application'.padEnd(boxWidth - 23) + '|');
    console.log('|' + '-v, --verbose'.padEnd(20) + '|' + 'Run with verbose logging'.padEnd(boxWidth - 23) + '|');
    console.log('|' + '-m, --generate-manifest'.padEnd(20) + '|' + 'Prompt to generate a manifest file if not present'.padEnd(boxWidth - 23) + '|');
    console.log('|' + '-b, --generate-background'.padEnd(20) + '|' + 'Prompt to generate a background script if not present'.padEnd(boxWidth - 23) + '|');
    console.log('|' + '-c, --generate-content'.padEnd(20) + '|' + 'Prompt to generate a content script if not present'.padEnd(boxWidth - 23) + '|');
    console.log('|' + '-p, --generate-popup'.padEnd(20) + '|' + 'Prompt to generate a popup script and HTML if not present'.padEnd(boxWidth - 23) + '|');
    console.log('|' + '-o, --generate-options'.padEnd(20) + '|' + 'Prompt to generate an options script and HTML if not present'.padEnd(boxWidth - 23) + '|');
    console.log('|' + '-a, --generate-action'.padEnd(20) + '|' + 'Prompt to generate an action script if not present'.padEnd(boxWidth - 23) + '|');
    console.log(horizontalLine);
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

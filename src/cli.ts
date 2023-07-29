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
    const commands = [
        { command: 'build', description: 'Build the Next.js application' },
        { command: '-v, --verbose', description: 'Run with verbose logging' },
        { command: '-m, --generate-manifest', description: 'Prompt to generate a manifest file if not present' },
        { command: '-b, --generate-background', description: 'Prompt to generate a background script if not present' },
        { command: '-c, --generate-content', description: 'Prompt to generate a content script if not present' },
        { command: '-p, --generate-popup', description: 'Prompt to generate a popup script and HTML if not present' },
        { command: '-o, --generate-options', description: 'Prompt to generate an options script and HTML if not present' },
        { command: '-a, --generate-action', description: 'Prompt to generate an action script if not present' },
    ];
    const maxCommandLength = Math.max(...commands.map(cmd => cmd.command.length));
    const maxDescriptionLength = Math.max(...commands.map(cmd => cmd.description.length));
    const totalWidth = maxCommandLength + maxDescriptionLength + 3;
    const horizontalLine = '+' + '-'.repeat(totalWidth) + '+';
    console.log(horizontalLine);
    for (const cmd of commands) {
        console.log('|' + cmd.command.padEnd(maxCommandLength) + '|' + cmd.description.padEnd(maxDescriptionLength) + '|');
    }
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

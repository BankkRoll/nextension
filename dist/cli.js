#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const build_1 = require("./build");
const utils_1 = require("./utils");
const boxWidth = 60;
(0, utils_1.initialize)({ verbose: true });
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
    const bannerText = 'Globally use the command like: nextension [option] or if locally npx nextension [option]';
    const longestCommand = Math.max(...commands.map(cmd => cmd.command.length));
    const longestDescription = Math.max(...commands.map(cmd => cmd.description.length));
    const totalWidth = Math.max(longestCommand + longestDescription + 3, bannerText.length + 2);
    const maxCommandLength = longestCommand;
    const maxDescriptionLength = totalWidth - maxCommandLength - 3;
    const horizontalLine = '+' + '-'.repeat(totalWidth) + '+';
    console.log(horizontalLine);
    console.log('|' + bannerText.padStart(totalWidth / 2 + bannerText.length / 2).padEnd(totalWidth) + '|');
    console.log(horizontalLine);
    console.log('|' + 'Option'.padEnd(maxCommandLength) + '|' + 'Description'.padEnd(maxDescriptionLength) + '|');
    console.log(horizontalLine);
    for (const cmd of commands) {
        console.log('|' + cmd.command.padEnd(maxCommandLength) + '|' + cmd.description.padEnd(maxDescriptionLength) + '|');
    }
    console.log(horizontalLine);
}
(0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
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
    const args = {
        verbose: argv.verbose,
        generateManifest: argv.generateManifest,
        generateBackground: argv.generateBackground,
        generateContent: argv.generateContent,
        generatePopup: argv.generatePopup,
        generateOptions: argv.generateOptions,
        generateAction: argv.generateAction
    };
    (0, build_1.build)(args);
})
    .command('*', 'default', () => { }, (argv) => {
    if (argv.verbose) {
        console.log('Verbose mode is on.');
    }
    const args = {
        verbose: argv.verbose,
        generateManifest: argv.generateManifest,
        generateBackground: argv.generateBackground,
        generateContent: argv.generateContent,
        generatePopup: argv.generatePopup,
        generateOptions: argv.generateOptions,
        generateAction: argv.generateAction
    };
    (0, build_1.build)(args);
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
//# sourceMappingURL=cli.js.map
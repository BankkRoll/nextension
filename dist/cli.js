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
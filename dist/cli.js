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
const horizontalLine = '+' + '-'.repeat(boxWidth) + '+';
(0, utils_1.initialize)({ verbose: true });
function customHelp() {
    (0, utils_1.log)(horizontalLine, 'highlight');
    (0, utils_1.log)('|' + ' '.repeat(boxWidth) + '|', 'highlight');
    (0, utils_1.log)('|' + 'Nextension Help'.padStart(boxWidth / 2).padEnd(boxWidth) + '|', 'highlight');
    (0, utils_1.log)('|' + ' '.repeat(boxWidth) + '|', 'highlight');
    (0, utils_1.log)('|' + 'build: Build the Next.js application'.padStart(boxWidth - 2).padEnd(boxWidth) + '|', 'highlight');
    (0, utils_1.log)('|' + '-v, --verbose: Run with verbose logging'.padStart(boxWidth - 2).padEnd(boxWidth) + '|', 'highlight');
    (0, utils_1.log)('|' + '-m, --generate-manifest: Prompt to generate a manifest file if not present'.padStart(boxWidth - 2).padEnd(boxWidth) + '|', 'highlight');
    (0, utils_1.log)('|' + '-b, --generate-background: Prompt to generate a background script if not present'.padStart(boxWidth - 2).padEnd(boxWidth) + '|', 'highlight');
    (0, utils_1.log)('|' + '-c, --generate-content: Prompt to generate a content script if not present'.padStart(boxWidth - 2).padEnd(boxWidth) + '|', 'highlight');
    (0, utils_1.log)('|' + '-p, --generate-popup: Prompt to generate a popup script and HTML if not present'.padStart(boxWidth - 2).padEnd(boxWidth) + '|', 'highlight');
    (0, utils_1.log)('|' + '-o, --generate-options: Prompt to generate an options script and HTML if not present'.padStart(boxWidth - 2).padEnd(boxWidth) + '|', 'highlight');
    (0, utils_1.log)('|' + '-a, --generate-action: Prompt to generate an action script if not present'.padStart(boxWidth - 2).padEnd(boxWidth) + '|', 'highlight');
    (0, utils_1.log)('|' + ' '.repeat(boxWidth) + '|', 'highlight');
    (0, utils_1.log)(horizontalLine, 'highlight');
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
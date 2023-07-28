#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { build } from './build';

// Create the CLI application
yargs(hideBin(process.argv))
    .command('build', 'Build the Next.js application', (yargs) => {
        return yargs.option('verbose', {
            alias: 'v',
            type: 'boolean',
            description: 'Run with verbose logging'
        });
    }, (argv) => {
        if (argv.verbose) {
            console.log('Verbose mode is on.');
        }
        build();
    })
    .command('*', 'default', () => {}, (argv) => {
        if (argv.verbose) {
            console.log('Verbose mode is on.');
        }
        build();
    }) // Set a default command
    .demandCommand(0, 0) // This allows for 0 commands
    .help()
    .alias('help', 'h')
    .argv;

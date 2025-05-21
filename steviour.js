#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

yargs(hideBin(process.argv))
    .command(require('./commands/init'))
    .command(require('./commands/run'))
    .help()
    .strict()
    .parse();
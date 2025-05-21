const { createConfig } = require('../utils/config');
const os = require('node:os');

module.exports = {
    command: 'init [compiler]',
    describe: 'Create server configuration',
    builder: yargs => yargs
        .positional('compiler', {
            describe: 'Choose compiler or language',
            default: 'node',
            type: 'string',
            choices: ["node", "python", "ruby"]
        })
        .option('serverName', {
            alias: 's',
            describe: 'Set server name manually',
            type: 'string'
        })
        .option('shardLength', {
            describe: "Set shard total",
            type: "number"
        })
        .option('force', {
            alias: 'f',
            describe: 'Force overwrite if config exists',
            type: 'boolean',
            default: false
        }),
    handler: (argv) => {
        const serverName = argv.serverName || os.hostname();
        createConfig(serverName, argv.force, argv);
    }
};
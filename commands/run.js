const { loadConfig, dir } = require('../utils/config');
const chalk = require('chalk');
const cfonts = require('cfonts');
const os = require('node:os');
const packageJson = require('../package.json');
const runShards = require('../core/runner');

module.exports = {
    command: 'run',
    describe: 'Start the server',
    builder: yargs => yargs
        .option('shardId', {
            describe: "Run with single runtime",
            type: "number"
        })
        .option('dev', {
            alias: 'd',
            describe: 'Development mode',
            type: 'boolean',
            default: false
        })
        .option('devdelay', {
            alias:"dd",
            describe: "Delay (in ms) after a file changes in development mode",
            type: "number",
            default: 1000
        }),
    handler: async (argv) => {
        const config = loadConfig();

        console.log(
            chalk.blue.bold(`Starting nodesteviour ${chalk.white(packageJson.version)}`) +
            (argv.dev ? chalk.yellow.bold(" — You are running in development mode") : "")
        );

        cfonts.say('Steviour', {
            align: 'center',
            gradient: ['gray', 'red']
        });

        console.log(
            `\n${chalk.cyan.bold('⤜ Project Name :')} ${chalk.dim.bold(config.name ?? 'Unknown')}` +
            `\n${chalk.cyan.bold('⤜ Author       :')} ${chalk.dim.bold(config.author ?? 'Unknown')}` +
            `\n${chalk.cyan.bold('⤜ Server       :')} ${chalk.dim.bold(config.serverName)}` +
            `\n${chalk.cyan.bold('⤜ OS           :')} ${chalk.dim.bold(os.type())}` +
            (config?.shardScheme?.total ?
                `\n${chalk.cyan.bold('⤜ Shard        :')} ${chalk.dim.bold(config?.shardScheme?.total)}` : "") +
            `\n${chalk.cyan.bold('⤜ CPU          :')}\n${chalk.dim.bold(
                os.cpus().map((cpu, i) =>
                    `${i === 0 ? `${os.cpus().length} Cores\n` : ''}${cpu.model} @${cpu.speed}MHz`
                ).join('\n')
            )}` +
            `\n${chalk.cyan.bold('⤜ Memory       :')} ${chalk.dim.bold(`${Math.floor(os.totalmem() / (1024 ** 3))} GB`)}\n`
        );

        await runShards(config, argv);
    }
};

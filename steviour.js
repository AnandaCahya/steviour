#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs');
const { spawn } = require('node:child_process');
const chalk = require('chalk');
const cfonts = require('cfonts');
const crypto = require('node:crypto');

const dir = process.cwd();
const currentFolder = path.basename(dir);
const configPath = path.join(dir, 'steviour.json');

class Print {
    constructor(id, name) {
        this.id = id;
        this.name = name ?? "FFFFF"
    }

    out(message) {
        const timestamp = new Date().toISOString();
        process.stdout.write(`${chalk.gray(`[${timestamp}]`)} ${chalk.magenta.bold(`□ [${this.id} - ${this.name}] ▻`)} ${message.toString()}`);
    }
}

const createConfig = (serverName, force = false, argv) => {
    const template = {
        serverName,
        name: currentFolder ?? "Unnamed Project",
        author: os.userInfo().username ?? "Unknown Person",
        main: "index.js",
        autoRestart: true,
        restartDelay: 2500
    };

    if (argv.shardLength) {
        template.shardScheme.total = argv.shardLength
    }

    if (argv.compiler) {
        template.compiler = argv.compiler
    }

    if (!fs.existsSync(configPath) || force) {
        fs.writeFileSync(configPath, JSON.stringify(template, null, 2));
        console.log(chalk.green(`${force ? 'Overwritten' : 'Created'} steviour.json successfully.`));
    } else {
        console.log(chalk.yellow('steviour.json already exists. Use --force to overwrite.'));
    }
};

const loadConfig = () => {
    if (!fs.existsSync(configPath)) {
        console.error(chalk.red(`steviour.json not found in ${dir}`));
        process.exit(1);
    }

    try {
        return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch (err) {
        console.error(chalk.red('Failed to parse steviour.json. Make sure it is valid JSON.'));
        process.exit(1);
    }
};

yargs(hideBin(process.argv))
    .command('init [compiler]', 'Create server configuration', yargs => {
        return yargs
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
            });
    }, argv => {
        const serverName = argv.serverName || os.hostname();
        createConfig(serverName, argv.force, argv);
    })

    .command('run', 'Start the server', yargs => {
        return yargs.option('shardId', {
            describe: "Run with single runtime",
            type: "number"
        })
    }, (argv) => {
        const config = loadConfig();
        const packageJson = require("./package.json")

        console.log(chalk.blue.bold(`Starting nodesteviour ${chalk.white(packageJson.version)}`));

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

        const shardCount = config?.shardScheme?.total ?? 1;

        const spawnProcess = (shardId, shardName) => {
            const printer = new Print(shardId, shardName);

            if (!config.script && !config.main) {
                console.error(chalk.red("No 'script' or 'main' defined in steviour.json"));
                process.exit(1);
            }

            const compiler = argv.compiler || 'node';
            const command = config.script
                ? spawn(config.script, { shell: true, cwd: dir, env: buildEnv(shardId, shardName, config), stdio: 'inherit' })
                : spawn(compiler, [config.main], { cwd: dir, env: buildEnv(shardId, shardName, config), stdio: 'inherit' });

            if (!command) {
                return printer.out(chalk.red("Failed to spawn the process. Please check the command and script path."));
            }

            command.on('close', code => {
                printer.out(`Process exited with code ${code}, restarting...\n`);
                if (config.autoRestart) {
                    setTimeout(() => {
                        spawnProcess(shardId, shardName)
                    }, config.restartDelay ?? 1000);
                }
            });
        };

        if (typeof argv.shardId === "number") {
            const input = `${argv.shardId}-${config.name}`;
            const hash = crypto.createHash('sha1').update(input).digest('hex');
            shardName = BigInt('0x' + hash).toString(36).toUpperCase().substring(0, 5);

            spawnProcess(argv.shardId, shardName);
        } else {
            for (let i = 0; i < shardCount; i++) {
                const input = `${i}-${config.name}`;
                const hash = crypto.createHash('sha1').update(input).digest('hex');
                shardName = BigInt('0x' + hash).toString(36).toUpperCase().substring(0, 6);

                spawnProcess(i, shardName);
            }
        }
    })
    .help()
    .strict()
    .parse();

function buildEnv(i, shardId, config) {
    return {
        ...process.env,
        SYSTEM_ID: i,
        SYSTEM_NAME: shardId,
        SYSTEM_SERVERNAME: config?.serverName,
        SYSTEM_SHARDLENGTH: config?.shardScheme?.total || 0
    };
}
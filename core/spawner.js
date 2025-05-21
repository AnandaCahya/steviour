const { spawn } = require('node:child_process');
const crypto = require('node:crypto');
const buildEnv = require('../utils/env');
const Print = require('../utils/printer');
const chalk = require('chalk');

const processes = new Map();

function spawnProcess(shardId, shardName, config, argv, dir) {
    const printer = new Print(shardId, shardName);

    if (!config.main && !config.script) {
        console.error(chalk.red("steviour.json missing both 'main' and 'script'. Cannot run."));
        process.exit(1);
    }

    const compiler = config.compiler || 'node';
    const command = config.script
        ? spawn(config.script, { shell: true, cwd: dir, env: buildEnv(shardId, shardName, config, argv), stdio: 'inherit' })
        : spawn(compiler, [config.main], { cwd: dir, env: buildEnv(shardId, shardName, config, argv), stdio: 'inherit' });

    processes.set(shardId, command);

    command.on("spawn", () => printer.out('Process started'));
    command.on('close', code => {
        if (config.autoRestart && !argv.dev) {
            printer.out(`Exited with code ${code}, restarting...`);
            setTimeout(() => spawnProcess(shardId, shardName, config, argv, dir), config.restartDelay ?? 1000);
        }
    });
}

function restartProcess(shardId, shardName, config, argv, dir) {
    const current = processes.get(shardId);
    if (current) current.kill();
    spawnProcess(shardId, shardName, config, argv, dir);
}

function generateShardName(index, name) {
    const input = `${index}-${name}`;
    const hash = crypto.createHash('sha1').update(input).digest('hex');
    return BigInt('0x' + hash).toString(36).toUpperCase().substring(0, 6);
}

module.exports = { spawnProcess, restartProcess, generateShardName };
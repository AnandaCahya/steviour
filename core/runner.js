const chokidar = require('chokidar');
const chalk = require('chalk');
const { delay, ignoreFile } = require('../utils/helpers');
const { dir } = require('../utils/config');
const { spawnProcess, restartProcess, generateShardName } = require('./spawner');

async function runShards(config, argv) {
    const shardCount = config?.shardScheme?.total ?? 1;

    let waiting;

    if (typeof argv.shardId === "number") {
        const shardName = generateShardName(argv.shardId, config.name);
        spawnProcess(argv.shardId, shardName, config, argv, dir);

        if (argv.dev) {
            chokidar.watch(dir, {
                ignored: ignoreFile,
                ignoreInitial: true,
                persistent: true
            }).on('all', () => {
                waiting = setTimeout(function () {
                    console.log(chalk.yellow(`[DEV] Detected change, restarting shard ${argv.shardId}...`));
                    restartProcess(argv.shardId, shardName, config, argv, dir);
                }, 1000)
            });
        }

    } else {
        for (let i = 0; i < shardCount; i++) {
            const shardName = generateShardName(i, config.name);
            spawnProcess(i, shardName, config, argv, dir);
            await delay(config?.shardScheme?.delay ?? 2000);
        }

        if (argv.dev) {
            chokidar.watch(dir, {
                ignored: ignoreFile,
                ignoreInitial: true
            }).on('all', () => {
                waiting = setTimeout(async function () {
                    console.log(chalk.yellow(`[DEV] Detected change, restarting all shards...`));
                    for (let i = 0; i < shardCount; i++) {
                        const shardName = generateShardName(i, config.name);
                        restartProcess(i, shardName, config, argv, dir);
                        await delay(config?.shardScheme?.delay ?? 2000);
                    }
                }, 1000)
            });
        }
    }
}

module.exports = runShards;

const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');
const chalk = require('chalk');

const dir = process.cwd();
const currentFolder = path.basename(dir);
const configPath = path.join(dir, 'steviour.json');

function createConfig(serverName, force = false, argv) {
    const template = {
        serverName,
        name: currentFolder ?? "Unnamed Project",
        author: os.userInfo().username ?? "Unknown Person",
        main: "index.js",
        autoRestart: true,
        restartDelay: 2500
    };

    if (argv.shardLength) {
        template.shardScheme = {
            total: argv.shardLength,
            delay: 2000
        };
    }

    if (argv.compiler) {
        template.compiler = argv.compiler;
    }

    if (!fs.existsSync(configPath) || force) {
        fs.writeFileSync(configPath, JSON.stringify(template, null, 2));
        console.log(chalk.green(`${force ? 'Overwritten' : 'Created'} steviour.json successfully.`));
    } else {
        console.log(chalk.yellow('steviour.json already exists. Use --force to overwrite.'));
    }
}

function loadConfig() {
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
}

module.exports = { createConfig, loadConfig, configPath, dir };
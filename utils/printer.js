const chalk = require('chalk');

class Print {
    constructor(id, name) {
        this.id = id;
        this.name = name ?? "FFFFF";
    }

    out(message) {
        const timestamp = new Date().toISOString();
        process.stdout.write(`${chalk.gray(`[${timestamp}]`)} ${chalk.magenta.bold(`□ [${this.id} - ${this.name}] ▻ `)} ${message}\n`);
    }
}

module.exports = Print;
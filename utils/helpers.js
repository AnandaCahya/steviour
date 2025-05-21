function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const ignorePatterns = [
    /node_modules/, /dist|build|public|static/, /coverage|logs?/,
    /\.log$|\.tsbuildinfo$/, /__pycache__|\.py[co]$/, /venv|env|\.tox/,
    /Gemfile|\.rb$/, /\.vscode|\.idea|\.git/, /\.env(\..*)?$/, /\.DS_Store|Thumbs\.db/
];

function ignoreFile(filePath) {
    return ignorePatterns.some(r => r.test(filePath));
}

module.exports = { delay, ignoreFile };
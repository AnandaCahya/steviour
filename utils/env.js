function buildEnv(i, shardId, config, argv) {
    return {
        ...process.env,
        SYSTEM_ID: i,
        SYSTEM_NAME: shardId,
        SYSTEM_SERVERNAME: config?.serverName,
        SYSTEM_SHARDLENGTH: config?.shardScheme?.total || 0,
        APP_ENV: argv.dev ? "development" : "deployment",
        NODE_ENV: argv.dev ? "development" : "deployment",
        FLASK_ENV: argv.dev ? "development" : "deployment"
    };
}

module.exports = buildEnv;
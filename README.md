# Steviour

**Steviour** is a Node.js-based CLI tool for generating server configuration files (`steviour.json`) and managing application runtimes with a lightweight sharding system—spawning multiple process instances based on your selected compiler (e.g. Node.js, Python, Ruby). It features automatic restarts on failure and displays detailed system information on startup. Ideal for running sharded or multi-process applications such as bots, microservices, or background workers across multiple CPU cores.

## Installation

```bash
npm i steviour -g
```

## How to use?

### Init configuration

```bash
steviour init --serverName=asia-1
```

And you get `steviour.json` default

```json
{
  "serverName": "DESKTOP-TBC69PH", //Device Name
  "name": "Aria-Tiktok-Downloader", //Project or Folder name
  "author": "ananda", //Device user
  "main": "index.js",  //Main file || change it with another nodejs option
  "shardScheme": {
    "total": 1 //Total shard
  }
}
```

For `main` you can change with `script`. And how it's work?

```json
{
    "script": "python index.py"
}
```

or another compiler like

```json
{
    "script": "ruby index.rb"
}
```

### Configuration

```json
{
  "serverName": "DESKTOP-TBC69PH", //Device Name
  "name": "Aria-Tiktok-Downloader", //Project or Folder name
  "author": "ananda", //Device user
  "main": "index.js",  //Main file || change it with script if you want custom runtime
  "compiler": "node", //Choices node, ruby, python
  "shardScheme": { //OPTIONAL - Will run single runtime if you not provide this
    "total": 1, //Total shard
    "delay": 4000 //Shard create delay (in milisecond)
  },
  "autoRestart": true, // Default: true - Change to 'false' to disable auto restart fail
  "restartDelay": 2500 // Change it to delay restart - Best option to avoid rate limit
}
```

### Shard identification

Steviour will set `ENVIRONMENT` in your shard runtime.

ENV | Desc | Data Type
---|---|---
SYSTEM_ID | Shard ID | Number
SYSTEM_NAME | Shard Unique ID | String
SYSTEM_SERVERNAME | Runtime hostname / server name | String
SYSTEM_SHARDLENGTH | Shard Total | Number
# Steviour

# Steviour

[![npm version](https://img.shields.io/npm/v/@anandacahya/steviour)](https://www.npmjs.com/package/@anandacahya/steviour)
[![npm downloads](https://img.shields.io/npm/dt/@anandacahya/steviour)](https://www.npmjs.com/package/@anandacahya/steviour)

**Steviour** is a Node.js-based CLI tool designed to generate server configuration files (`steviour.json`) and manage application runtimes using a lightweight sharding system. It spawns multiple process instances based on your selected runtime/compiler (e.g., Node.js, Python, Ruby). Steviour features automatic restarts on failure and displays system information at startup, making it ideal for running sharded or multi-process applications such as bots, microservices, or background workers across multiple CPU cores.

---

## Installation

```bash
npm i steviour -g
```

---

## Getting Started

### Initialize Configuration

Use the following command to generate an initial server configuration in your project:

#### Command

```bash
steviour.js init [compiler]
```

Example:

```bash
steviour init --serverName=asia-1
```

This will generate a default `steviour.json` file like this:

```json
{
  "serverName": "DESKTOP-TBC69PH",
  "name": "Backend-Odading",
  "author": "ananda",
  "main": "index.js",
  "shardScheme": {
    "total": 1
  }
}
```

You can replace `main` with `script` if using a custom runtime:

```json
{
  "script": "python index.py"
}
```

Or another language:

```json
{
  "script": "ruby index.rb"
}
```

#### Positional Arguments

* `compiler`: Specifies the programming language or compiler to use.
  **Options:** `"node"`, `"python"`, `"ruby"`
  **Default:** `"node"`

#### Options

| Option          | Alias | Description                                            | Type    | Default |
| --------------- | ----- | ------------------------------------------------------ | ------- | ------- |
| `--version`     |       | Display the current version of `steviour.js`           | boolean |         |
| `--help`        |       | Show help message                                      | boolean |         |
| `--serverName`  | `-s`  | Set the server name manually                           | string  |         |
| `--shardLength` |       | Set the number of total shards                         | number  |         |
| `--force`       | `-f`  | Force overwrite if a configuration file already exists | boolean | `false` |

#### Usage Examples

```bash
# Initialize with the default (Node.js)
steviour.js init

# Initialize with Python
steviour.js init python

# Initialize with server name and specific shard count
steviour.js init node -s asia1 --shardLength 5

# Force initialization (overwrite existing config)
steviour.js init --force
```

---

## Configuration File (`steviour.json`)

Here’s a complete example configuration:

```json
{
  "serverName": "DESKTOP-TBC69PH",
  "name": "Backend-Odading",
  "author": "ananda",
  "main": "index.js",
  "compiler": "node",
  "shardScheme": {
    "total": 1,
    "delay": 4000
  },
  "autoRestart": true,
  "restartDelay": 2500
}
```

**Configuration Fields Explained:**

* `main`: Entry file for Node.js (use `script` for other runtimes)
* `compiler`: Language runtime used (`node`, `python`, `ruby`)
* `shardScheme.total`: Total number of shards to spawn
* `shardScheme.delay`: Delay between spawning each shard (in ms)
* `autoRestart`: Automatically restart the process on failure (default: true)
* `restartDelay`: Delay before restarting a failed process (in ms)

---

## Shard Environment Variables

When your app runs, Steviour sets the following environment variables:

| ENV Variable         | Description             | Type   |
| -------------------- | ----------------------- | ------ |
| `SYSTEM_ID`          | Shard ID                | Number |
| `SYSTEM_NAME`        | Unique shard identifier | String |
| `SYSTEM_SERVERNAME`  | Hostname / server name  | String |
| `SYSTEM_SHARDLENGTH` | Total number of shards  | Number |

---

## Running Steviour

Run the application from your project directory:

```bash
steviour run
```

### Running a Specific Shard

To run a specific shard manually (ignoring the `shardScheme.total`):

```bash
steviour run --shardId=12
```

Useful for custom shard managers or debugging single shards.

### Development Mode

Enable auto-restart on file changes (great for development and testing):

```bash
steviour run --dev
```

### Example usage in your code

#### Example Code Using Steviour

Below are simple runtime examples in **Node.js** and **Python** that can be managed using **Steviour** with environment-based sharding.

---

##### Node.js Example (`index.js`)

```js
// index.js
console.log('🟢 Node Shard Running');
console.log('🧩 Environment Info:');
console.log(`- SYSTEM_ID: ${process.env.SYSTEM_ID}`);
console.log(`- SYSTEM_NAME: ${process.env.SYSTEM_NAME}`);
console.log(`- SYSTEM_SERVERNAME: ${process.env.SYSTEM_SERVERNAME}`);
console.log(`- SYSTEM_SHARDLENGTH: ${process.env.SYSTEM_SHARDLENGTH}`);

// Simulate workload
setInterval(() => {
  console.log(`Shard ${process.env.SYSTEM_ID} is doing work...`);
}, 3000);
```

##### Sample `steviour.json` Configuration for Node.js:

```json
{
  "serverName": "localhost-node",
  "name": "NodeExample",
  "author": "ananda",
  "main": "index.js",
  "compiler": "node",
  "shardScheme": {
    "total": 3,
    "delay": 2000
  },
  "autoRestart": true,
  "restartDelay": 1000
}
```

---

##### Python Example (`index.py`)

```python
# index.py
import os
import time

print("🟢 Python Shard Running")
print("🧩 Environment Info:")
print(f"- SYSTEM_ID: {os.getenv('SYSTEM_ID')}")
print(f"- SYSTEM_NAME: {os.getenv('SYSTEM_NAME')}")
print(f"- SYSTEM_SERVERNAME: {os.getenv('SYSTEM_SERVERNAME')}")
print(f"- SYSTEM_SHARDLENGTH: {os.getenv('SYSTEM_SHARDLENGTH')}")

# Simulate workload
while True:
    print(f"Shard {os.getenv('SYSTEM_ID')} is doing work...")
    time.sleep(3)
```

##### Sample `steviour.json` Configuration for Python:

```json
{
  "serverName": "localhost-python",
  "name": "PythonExample",
  "author": "ananda",
  "script": "python index.py",
  "compiler": "python",
  "shardScheme": {
    "total": 3,
    "delay": 2000
  },
  "autoRestart": true,
  "restartDelay": 1000
}
```

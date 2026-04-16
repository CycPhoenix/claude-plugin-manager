'use strict';

const chalk = require('chalk');
const { setToken, deleteToken, getToken } = require('../auth/tokens');

async function setTokenCmd(token) {
  if (!token) {
    console.error(chalk.red('Usage: cpm auth set-token <token>'));
    process.exit(1);
  }
  await setToken(token);
  console.log(chalk.green('GitHub token saved.'));
}

async function status() {
  const token = await getToken();
  if (token) {
    console.log(chalk.green(`Token stored: ${token.slice(0, 8)}...`));
  } else {
    console.log(chalk.yellow('No token stored. Run: cpm auth set-token <your-github-token>'));
  }
}

async function remove() {
  await deleteToken();
  console.log(chalk.green('Token removed.'));
}

module.exports = { setTokenCmd, status, remove };

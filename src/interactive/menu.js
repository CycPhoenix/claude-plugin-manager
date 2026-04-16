'use strict';

const inquirer = require('inquirer');
const { run: runInstall } = require('../commands/install');
const { run: runSearch } = require('../commands/search');
const { run: runList } = require('../commands/list');
const { run: runRemove } = require('../commands/remove');

async function run() {
  const { action } = await inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: 'Claude Plugin Manager',
    choices: [
      { name: 'Install plugin from URL', value: 'install' },
      { name: 'Browse/search registry', value: 'search' },
      { name: 'List installed plugins', value: 'list' },
      { name: 'Remove a plugin', value: 'remove' },
      { name: 'Exit', value: 'exit' }
    ]
  }]);

  if (action === 'exit') return;

  if (action === 'install') {
    const { url } = await inquirer.prompt([{
      type: 'input',
      name: 'url',
      message: 'Plugin URL (GitHub repo or direct URL):',
      validate: v => v.trim().length > 0 || 'URL required'
    }]);
    await runInstall(url.trim());
  }

  if (action === 'search') {
    const { query } = await inquirer.prompt([{
      type: 'input',
      name: 'query',
      message: 'Search query (leave blank to list all):'
    }]);
    await runSearch(query.trim());
  }

  if (action === 'list') {
    await runList();
  }

  if (action === 'remove') {
    const { name } = await inquirer.prompt([{
      type: 'input',
      name: 'name',
      message: 'Plugin name to remove:',
      validate: v => v.trim().length > 0 || 'Name required'
    }]);
    await runRemove(name.trim());
  }
}

module.exports = { run };

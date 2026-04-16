'use strict';

const chalk = require('chalk');
const inquirer = require('inquirer');
const ccSkill = require('../targets/cc-skill');
const ccMcp = require('../targets/cc-mcp');
const ccHook = require('../targets/cc-hook');
const cowork = require('../targets/cowork');

const TARGET_HANDLERS = { 'cc-skill': ccSkill, 'cc-mcp': ccMcp, 'cc-hook': ccHook, cowork };

async function run(name) {
  const { confirm } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirm',
    message: `Remove plugin ${chalk.bold(name)}?`,
    default: false
  }]);
  if (!confirm) return;

  // We don't have full manifest at remove time, so try all handlers
  let removed = false;
  for (const handler of Object.values(TARGET_HANDLERS)) {
    try {
      await handler.uninstall({ name, author: null, version: null });
      removed = true;
    } catch {
      // handler may not have this plugin — continue
    }
  }

  if (removed) {
    console.log(chalk.green(`Removed ${name}`));
  } else {
    console.log(chalk.yellow(`Plugin ${name} not found in any install target.`));
  }
}

module.exports = { run };

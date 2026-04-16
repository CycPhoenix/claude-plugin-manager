'use strict';

const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const { installPlugin } = require('../core/installer');
const { fetchFromUrl } = require('../core/fetcher');
const { detectTargets, validateManifest } = require('../core/detector');
const { getToken } = require('../auth/tokens');

const TARGET_LABELS = {
  'cc-skill': 'Claude Code Skill',
  'cc-mcp': 'Claude Code MCP Server',
  'cc-hook': 'Claude Code Hook',
  cowork: 'Cowork Plugin'
};

async function run(url) {
  const token = await getToken();
  const spinner = ora(`Fetching ${url}...`).start();

  let manifest, files;
  try {
    ({ manifest, files } = await fetchFromUrl(url, token));
    validateManifest(manifest);
    spinner.succeed(`Fetched ${chalk.bold(manifest.name)} v${manifest.version}`);
  } catch (err) {
    spinner.fail(chalk.red(err.message));
    process.exit(1);
  }

  const detected = detectTargets(manifest);
  const { chosenTargets } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'chosenTargets',
    message: 'Install to which targets?',
    choices: detected.map(t => ({ name: TARGET_LABELS[t] || t, value: t, checked: true })),
    validate: v => v.length > 0 || 'Select at least one target'
  }]);

  const installSpinner = ora('Installing...').start();
  try {
    const results = await installPlugin(url, chosenTargets, token);
    installSpinner.succeed(chalk.green(`Installed ${manifest.name} v${manifest.version}`));
    for (const r of results) {
      console.log(`  ${chalk.cyan(TARGET_LABELS[r.target] || r.target)}: ${r.installedPath || 'done'}`);
    }
  } catch (err) {
    installSpinner.fail(chalk.red(err.message));
    process.exit(1);
  }
}

module.exports = { run };

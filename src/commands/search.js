'use strict';

const chalk = require('chalk');
const ora = require('ora');
const { fetchRegistry, searchRegistry } = require('../core/registry');

async function run(query = '') {
  const spinner = ora('Fetching registry...').start();
  let registry;
  try {
    registry = await fetchRegistry();
    spinner.stop();
  } catch (err) {
    spinner.fail(chalk.red(`Failed to fetch registry: ${err.message}`));
    process.exit(1);
  }

  const results = searchRegistry(registry, query);
  if (results.length === 0) {
    console.log(chalk.yellow(`No plugins found${query ? ` for "${query}"` : ''}.`));
    return;
  }

  console.log(chalk.bold(`\n${results.length} plugin(s) found:\n`));
  for (const p of results) {
    console.log(`${chalk.cyan(p.name)} ${chalk.gray(`by ${p.author}`)}`);
    console.log(`  ${p.description}`);
    console.log(`  ${chalk.gray(p.url)}`);
    if (p.tags && p.tags.length) console.log(`  Tags: ${p.tags.join(', ')}`);
    console.log();
  }
}

module.exports = { run };

#!/usr/bin/env node
'use strict';

const chalk = require('chalk');
const { run: runInstall } = require('./commands/install');
const { run: runSearch } = require('./commands/search');
const { run: runList } = require('./commands/list');
const { run: runRemove } = require('./commands/remove');
const { setTokenCmd, status: authStatus, remove: authRemove } = require('./commands/auth');
const { run: runMenu } = require('./interactive/menu');

const [,, command, ...args] = process.argv;

async function main() {
  switch (command) {
    case 'install':
      if (!args[0]) { console.error(chalk.red('Usage: cpm install <url|name>')); process.exit(1); }
      await runInstall(args[0]);
      break;
    case 'search':
      await runSearch(args[0] || '');
      break;
    case 'list':
      await runList();
      break;
    case 'remove':
      if (!args[0]) { console.error(chalk.red('Usage: cpm remove <name>')); process.exit(1); }
      await runRemove(args[0]);
      break;
    case 'auth':
      if (args[0] === 'set-token') await setTokenCmd(args[1]);
      else if (args[0] === 'status') await authStatus();
      else if (args[0] === 'remove') await authRemove();
      else { console.error(chalk.red('Usage: cpm auth set-token <token> | status | remove')); process.exit(1); }
      break;
    case '--version':
    case '-v':
      console.log(require('../package.json').version);
      break;
    case '--help':
    case '-h':
      console.log(`
${chalk.bold('cpm')} — Claude Plugin Manager

${chalk.bold('Usage:')}
  cpm install <url>          Install plugin from URL
  cpm search [query]         Browse or search registry
  cpm list                   List installed plugins
  cpm remove <name>          Remove a plugin
  cpm auth set-token <tok>   Store GitHub PAT
  cpm auth status            Show token status
  cpm auth remove            Remove stored token
  cpm                        Interactive mode
      `.trim());
      break;
    case undefined:
      await runMenu();
      break;
    default:
      console.error(chalk.red(`Unknown command: ${command}`));
      console.error('Run cpm --help for usage.');
      process.exit(1);
  }
}

main().catch(err => {
  console.error(chalk.red(`Error: ${err.message}`));
  process.exit(1);
});

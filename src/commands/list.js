'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { getCoworkPluginsDir } = require('../utils/paths');

async function run() {
  const baseDir = getCoworkPluginsDir();
  if (!fs.existsSync(baseDir)) {
    console.log(chalk.yellow('No plugins installed yet.'));
    return;
  }

  const installed = [];
  for (const author of fs.readdirSync(baseDir)) {
    const authorDir = path.join(baseDir, author);
    if (!fs.statSync(authorDir).isDirectory()) continue;
    for (const name of fs.readdirSync(authorDir)) {
      const nameDir = path.join(authorDir, name);
      if (!fs.statSync(nameDir).isDirectory()) continue;
      for (const version of fs.readdirSync(nameDir)) {
        const manifestPath = path.join(nameDir, version, 'manifest.json');
        if (fs.existsSync(manifestPath)) {
          try {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            installed.push(manifest);
          } catch {
            installed.push({ name, version, author });
          }
        }
      }
    }
  }

  if (installed.length === 0) {
    console.log(chalk.yellow('No plugins installed yet.'));
    return;
  }

  console.log(chalk.bold(`\n${installed.length} plugin(s) installed:\n`));
  for (const p of installed) {
    console.log(`${chalk.cyan(p.name)} v${p.version} ${chalk.gray(`by ${p.author || 'unknown'}`)}`);
    if (p.description) console.log(`  ${p.description}`);
    console.log();
  }
}

module.exports = { run };

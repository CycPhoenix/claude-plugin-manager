'use strict';

const fs = require('fs');
const path = require('path');

async function ensureDir(dirPath) {
  await fs.promises.mkdir(dirPath, { recursive: true });
}

async function backupFile(filePath) {
  try {
    await fs.promises.copyFile(filePath, `${filePath}.bak`);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

async function safeWriteJson(filePath, data) {
  await ensureDir(path.dirname(filePath));
  await backupFile(filePath);
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

async function readJsonFile(filePath) {
  let raw;
  try {
    raw = await fs.promises.readFile(filePath, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') throw new Error(`File not found: ${filePath}`);
    throw err;
  }
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Failed to parse JSON in ${filePath}: ${err.message}`);
  }
}

module.exports = { ensureDir, backupFile, safeWriteJson, readJsonFile };

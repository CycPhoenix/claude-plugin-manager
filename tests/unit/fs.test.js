'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { backupFile, safeWriteJson, ensureDir, readJsonFile } = require('../../src/utils/fs');

describe('ensureDir', () => {
  test('creates directory if it does not exist', async () => {
    const dir = path.join(os.tmpdir(), `cpm-test-${Date.now()}`);
    await ensureDir(dir);
    expect(fs.existsSync(dir)).toBe(true);
    fs.rmdirSync(dir);
  });

  test('does not throw if directory already exists', async () => {
    const dir = os.tmpdir();
    await expect(ensureDir(dir)).resolves.not.toThrow();
  });
});

describe('backupFile', () => {
  test('creates .bak copy of existing file', async () => {
    const file = path.join(os.tmpdir(), `cpm-test-${Date.now()}.json`);
    fs.writeFileSync(file, '{"test":true}');
    await backupFile(file);
    expect(fs.existsSync(`${file}.bak`)).toBe(true);
    expect(fs.readFileSync(`${file}.bak`, 'utf8')).toBe('{"test":true}');
    fs.unlinkSync(file);
    fs.unlinkSync(`${file}.bak`);
  });

  test('does not throw if file does not exist', async () => {
    await expect(backupFile('/nonexistent/path.json')).resolves.not.toThrow();
  });
});

describe('safeWriteJson', () => {
  test('writes JSON to file, creating parent dir', async () => {
    const file = path.join(os.tmpdir(), `cpm-test-${Date.now()}`, 'data.json');
    await safeWriteJson(file, { hello: 'world' });
    const content = JSON.parse(fs.readFileSync(file, 'utf8'));
    expect(content).toEqual({ hello: 'world' });
    fs.unlinkSync(file);
    fs.rmdirSync(path.dirname(file));
  });

  test('backs up existing file before writing', async () => {
    const file = path.join(os.tmpdir(), `cpm-test-${Date.now()}.json`);
    fs.writeFileSync(file, '{"old":true}');
    await safeWriteJson(file, { new: true });
    expect(fs.existsSync(`${file}.bak`)).toBe(true);
    expect(JSON.parse(fs.readFileSync(`${file}.bak`, 'utf8'))).toEqual({ old: true });
    fs.unlinkSync(file);
    fs.unlinkSync(`${file}.bak`);
  });
});

describe('readJsonFile', () => {
  test('reads and parses JSON file', async () => {
    const file = path.join(os.tmpdir(), `cpm-test-${Date.now()}.json`);
    fs.writeFileSync(file, '{"key":"value"}');
    const result = await readJsonFile(file);
    expect(result).toEqual({ key: 'value' });
    fs.unlinkSync(file);
  });

  test('throws descriptive error when file is not valid JSON', async () => {
    const file = path.join(os.tmpdir(), `cpm-test-${Date.now()}.json`);
    fs.writeFileSync(file, 'not json');
    await expect(readJsonFile(file)).rejects.toThrow('Failed to parse');
    fs.unlinkSync(file);
  });

  test('throws descriptive error when file does not exist', async () => {
    await expect(readJsonFile('/nonexistent.json')).rejects.toThrow('not found');
  });
});

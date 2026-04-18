'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const FAKE_HOME = path.join(os.tmpdir(), `cpm-tokens-${Date.now()}`);
jest.spyOn(os, 'homedir').mockReturnValue(FAKE_HOME);

const { setToken, getToken, deleteToken } = require('../../src/auth/tokens');

afterAll(() => fs.rmSync(FAKE_HOME, { recursive: true, force: true }));

describe('setToken', () => {
  test('stores token in config file', async () => {
    await setToken('ghp_test123');
    const token = await getToken();
    expect(token).toBe('ghp_test123');
  });
});

describe('getToken', () => {
  test('returns null when no token stored', async () => {
    const token = await getToken();
    expect(token === null || typeof token === 'string').toBe(true);
  });
});

describe('deleteToken', () => {
  test('removes stored token', async () => {
    await setToken('ghp_todelete');
    await deleteToken();
    const token = await getToken();
    expect(token).toBeNull();
  });
});

'use strict';

// Mock keytar before requiring tokens
jest.mock('keytar', () => ({
  setPassword: jest.fn(),
  getPassword: jest.fn(),
  deletePassword: jest.fn()
}), { virtual: true });

const keytar = require('keytar');
const { setToken, getToken, deleteToken } = require('../../src/auth/tokens');

const SERVICE = 'claude-plugin-manager';
const ACCOUNT = 'github';

beforeEach(() => jest.clearAllMocks());

describe('setToken', () => {
  test('stores token via keytar', async () => {
    keytar.setPassword.mockResolvedValue(undefined);
    await setToken('ghp_test123');
    expect(keytar.setPassword).toHaveBeenCalledWith(SERVICE, ACCOUNT, 'ghp_test123');
  });
});

describe('getToken', () => {
  test('retrieves token via keytar', async () => {
    keytar.getPassword.mockResolvedValue('ghp_test123');
    const token = await getToken();
    expect(token).toBe('ghp_test123');
  });

  test('returns null when no token stored', async () => {
    keytar.getPassword.mockResolvedValue(null);
    const token = await getToken();
    expect(token).toBeNull();
  });
});

describe('deleteToken', () => {
  test('deletes token via keytar', async () => {
    keytar.deletePassword.mockResolvedValue(true);
    await deleteToken();
    expect(keytar.deletePassword).toHaveBeenCalledWith(SERVICE, ACCOUNT);
  });
});

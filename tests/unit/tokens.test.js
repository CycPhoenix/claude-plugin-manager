'use strict';

const mockEntry = {
  setPassword: jest.fn(),
  getPassword: jest.fn(),
  deletePassword: jest.fn()
};

jest.mock('@napi-rs/keyring', () => ({
  Entry: jest.fn(() => mockEntry)
}), { virtual: true });

const { setToken, getToken, deleteToken } = require('../../src/auth/tokens');

beforeEach(() => jest.clearAllMocks());

describe('setToken', () => {
  test('stores token via keyring Entry', async () => {
    await setToken('ghp_test123');
    expect(mockEntry.setPassword).toHaveBeenCalledWith('ghp_test123');
  });
});

describe('getToken', () => {
  test('retrieves token via keyring Entry', async () => {
    mockEntry.getPassword.mockReturnValue('ghp_test123');
    const token = await getToken();
    expect(token).toBe('ghp_test123');
  });

  test('returns null when keyring throws', async () => {
    mockEntry.getPassword.mockImplementation(() => { throw new Error('not found'); });
    const token = await getToken();
    expect(token).toBeNull();
  });
});

describe('deleteToken', () => {
  test('deletes token via keyring Entry', async () => {
    await deleteToken();
    expect(mockEntry.deletePassword).toHaveBeenCalled();
  });
});

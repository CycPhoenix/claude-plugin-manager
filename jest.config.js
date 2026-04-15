module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.js'],
  coverageThreshold: {
    global: { lines: 80, functions: 80, branches: 80, statements: 80 }
  },
  testMatch: ['**/tests/**/*.test.js']
};

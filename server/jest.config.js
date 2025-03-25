module.exports = {
  testEnvironment: 'node',
  testTimeout: 60000,
  setupFiles: ['dotenv/config'],
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/test/'
  ]
};
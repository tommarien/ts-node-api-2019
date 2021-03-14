module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ["dist"],
  setupFilesAfterEnv: [
    "dotenv/config",
    "<rootDir>/jest.setup.js"
  ],
  roots: ['<rootDir>/src'],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ]
};

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "**/?(*.)+(spec).[jt]s?(x)"
  ],
  setupFilesAfterEnv: [
    "jest-extended",
    "<rootDir>/jest.setup.js"
  ],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ]
};

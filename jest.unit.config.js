module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "**/?(*.)+(spec).[jt]s?(x)"
  ],
  testPathIgnorePatterns: ["dist"],
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.js"
  ],
  roots:['<rootDir>/src'],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ]
};

/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  moduleNameMapper: {
    '^routes/(.*)$': '<rootDir>/routes/$1',
    '^routes$': '<rootDir>/routes',
    '^controllers/(.*)$': '<rootDir>/controllers/$1',
    '^controllers$': '<rootDir>/controllers',
    '^models/(.*)$': '<rootDir>/models/$1',
    '^models$': '<rootDir>/models',
    '^utils/(.*)$': '<rootDir>/utils/$1',
    '^utils$': '<rootDir>/utils',
    '^middlewares/(.*)$': '<rootDir>/middlewares/$1',
    '^middlewares$': '<rootDir>/middlewares',
  },
  modulePaths: ['<rootDir>/src'],
};
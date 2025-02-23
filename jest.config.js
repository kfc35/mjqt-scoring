/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  testPathIgnorePatterns: ['<rootDir>/dist/'],
  moduleDirectories: ["node_modules", "src"],
};
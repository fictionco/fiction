module.exports = {
  testEnvironment: "node",

  expand: true,

  forceExit: true,

  roots: ["<rootDir>/@factor", "<rootDir>/test"],

  // https://github.com/facebook/jest/pull/6747 fix warning here
  // But its performance overhead is pretty bad (30+%).
  // detectOpenHandles: true,

  setupFilesAfterEnv: ["./test/utils/setup"],

  coverageDirectory: "./coverage",

  collectCoverageFrom: ["**/@factor/**/*.js"],

  coveragePathIgnorePatterns: ["node_modules/(?!(@factor|factor))"],

  testPathIgnorePatterns: [
    "node_modules/(?!(@factor|factor))",
    "test/fixtures/.*/.*?/",
    "examples/.*"
  ],

  transformIgnorePatterns: ["node_modules/(?!(@factor|factor))"],

  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.vue$": "vue-jest"
  },

  moduleFileExtensions: ["js", "json"],

  reporters: ["default", ["jest-junit", { outputDirectory: "reports/junit" }]]
}

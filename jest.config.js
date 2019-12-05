module.exports = {
  testEnvironment: "node",

  expand: true,

  forceExit: true,

  roots: ["<rootDir>/@factor", "<rootDir>/test"],

  setupFilesAfterEnv: ["./test/config/setup.ts"],

  testMatch: ["**/?(*.|*-)+(spec|test).[jt]s?(x)"],
  testPathIgnorePatterns: [
    "node_modules/(?!(@factor|factor))",
    "test/fixtures/.*/.*?/",
    "examples/.*"
  ],

  watchPathIgnorePatterns: ["dist/.*", ".factor/.*"],

  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/test/config/mock-file",
    "\\.(css|less)$": "<rootDir>/test/config/mock-style",
    "__FALLBACK__(.*).(js|vue|ts)$": "<rootDir>/@factor/app/$1",
    "__CWD__/(.*)$": "<rootDir>/test/modules/alias/$1",
    "__SRC__/(.*)$": "<rootDir>/test/modules/alias/$1"
  },

  transformIgnorePatterns: ["node_modules/(?!(@factor|factor|lodash-es))"],

  transform: {
    "^.+\\.ts$": "ts-jest",
    "^.+\\.js$": "babel-jest",
    "^.+\\.vue$": "vue-jest"
  },

  globals: {
    "ts-jest": {
      tsConfig: {
        strict: false,
        checkJs: false
      },
      isolatedModules: true
    }
  },

  moduleFileExtensions: ["js", "ts", "json", "vue"],

  coverageDirectory: "./coverage",

  collectCoverageFrom: ["**/@factor/**/*.[jt]s"],

  coveragePathIgnorePatterns: ["node_modules/(?!(@factor|factor))", "fixtures"],

  reporters: ["default", ["jest-junit", { outputDirectory: "reports/junit" }]]
}

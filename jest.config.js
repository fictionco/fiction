module.exports = {
  testEnvironment: "node",

  expand: true,

  forceExit: true,

  roots: ["<rootDir>/@factor", "<rootDir>/test"],

  setupFilesAfterEnv: ["./test/utils/setup"],

  testPathIgnorePatterns: [
    "node_modules/(?!(@factor|factor))",
    "test/fixtures/.*/.*?/",
    "examples/.*"
  ],

  watchPathIgnorePatterns: ["dist/.*", ".factor/.*"],

  moduleNameMapper: {
    "#(.*)$": "<rootDir>/@factor/@core/app/$1",
    "~/(.*)$": "<rootDir>/test/modules/alias/$1",
    "@/(.*)$": "<rootDir>/test/modules/alias/$1",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/test/utils/mock-file.js",
    "\\.(css|less)$": "<rootDir>/test/utils/mock-style.js"
  },

  transformIgnorePatterns: ["node_modules/(?!(@factor|factor))"],

  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.vue$": "vue-jest"
  },

  moduleFileExtensions: ["js", "json", "vue"],

  coverageDirectory: "./coverage",

  collectCoverageFrom: ["**/@factor/**/*.js"],

  coveragePathIgnorePatterns: ["node_modules/(?!(@factor|factor))", "fixtures"],

  reporters: ["default", ["jest-junit", { outputDirectory: "reports/junit" }]]
}

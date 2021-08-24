import type { Config } from "@jest/types"
import baseTSConfig from "./tsconfig.json"

const getTextMatch = (): string[] => {
  let testMatch = "**/*.spec.ts"

  if (process.env.TEST_FIXTURES) {
    testMatch = "**/*.fixture.ts"
  }
  return [testMatch]
}

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testMatch: getTextMatch(),
  testTimeout: process.env.CI ? 30_000 : 10_000,
  globalSetup: "./@test/test-config/globalSetup.ts",
  globalTeardown: "./@test/test-config/globalTeardown.ts",
  // testEnvironment: "./test/jestEnv.js",
  // setupFilesAfterEnv: ["./test/jestPerTestSetup.ts"],
  watchPathIgnorePatterns: ["<rootDir>/temp"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/cdk.out/",
    "/clickhouse/",
    "/docker/",
  ],
  moduleNameMapper: {
    testUtils: "<rootDir>/packages/playground/testUtils.ts",
  },
  globals: {
    "ts-jest": {
      tsconfig: {
        ...baseTSConfig.compilerOptions,
        strict: false,
        allowJs: true,
        module: "commonjs",
        esModuleInterop: true,
        skipLibCheck: true,
      },
      diagnostics: true,
      isolatedModules: true, // disable type checking i.e. compiler only
    },
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@factor|factor|lodash-es|dayjs))",
  ],

  transform: {
    "\\.ts$": "ts-jest",
    "\\.js$": "ts-jest",
    "\\.vue$": "vue-jest",
  },
}

export default config

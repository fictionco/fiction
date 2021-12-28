const BASIC_ONLY = process.env.LINT_ENV == "basic" ? true : false

const tsLintConfig = BASIC_ONLY
  ? "plugin:@typescript-eslint/recommended"
  : "plugin:@typescript-eslint/recommended-requiring-type-checking"

const tsLintRules = BASIC_ONLY
  ? {
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
    }
  : {
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
    }

module.exports = {
  root: true,
  globals: {
    module: false,
    process: false,
    cy: false,
    Cypress: false,
    to: false,
    describe: false,
    context: false,
    globalThis: false,
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    sourceType: "module",
    parser: "@typescript-eslint/parser",
    project: "./tsconfig.json",
    extraFileExtensions: [".vue", ".json", ".cjs", ".mjs"],
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  ignorePatterns: [
    "node_modules",
    "**/node_modules/**",
    "cdk.out/**",
    "**/regex*",
    "*eslint*",
  ],
  extends: [
    "plugin:unicorn/recommended",
    "plugin:jest/recommended",
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    tsLintConfig,
    "plugin:vue/vue3-recommended",
    "prettier",
  ],

  plugins: [
    "json",
    "prettier",
    "unicorn",
    "import",
    "jest",
    "@typescript-eslint",
    "implicit-dependencies",
  ],

  rules: {
    "implicit-dependencies/no-implicit": [
      "error",
      { peer: true, dev: true, optional: true },
    ],
    semi: ["error", "never"],
    "jest/no-disabled-tests": "off",
    "jest/no-commented-out-tests": "off",
    "jest/expect-expect": "off",
    "no-console": ["error", { allow: ["warn", "error"] }],
    "no-debugger": "error",
    "vue/no-v-html": "off",
    "no-undef": "off",
    "func-style": ["warn", "expression"],
    "no-async-promise-executor": "off",
    "import/no-cycle": 2,
    "import/no-unresolved": "off",
    "import/named": "off",
    "import/extensions": [
      "warn",
      "ignorePackages",
      { ts: "never", js: "never" },
    ],
    "unicorn/no-abusive-eslint-disable": 0,
    "unicorn/prevent-abbreviations": "off",
    "unicorn/filename-case": "off",
    "unicorn/prefer-ternary": "off",
    "unicorn/no-nested-ternary": "off",
    "unicorn/no-array-reduce": "off",
    "unicorn/prefer-switch": "off",
    "unicorn/prefer-export-from": "off",
    "unicorn/explicit-length-check": "off", // sometimes we need to use length
    "unicorn/consistent-destructuring": "off",
    "unicorn/prefer-module": "off",
    "unicorn/no-null": "off",
    "unicorn/no-fn-reference-in-iterator": "off",
    "unicorn/no-useless-undefined": "off",
    "unicorn/no-array-for-each": "off",
    "unicorn/prefer-node-protocol": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/prefer-namespace-keyword": "off",
    "@typescript-eslint/no-namespace": 0,
    "@typescript-eslint/explicit-function-return-type": "off", // overridden for .ts files
    "@typescript-eslint/no-use-before-define": "warn", // can cause organization issues
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-var-requires": "off", // overridden for transpiled .ts files
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/member-delimiter-style": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-unnecessary-type-assertion": "off",

    ...tsLintRules,
  },
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": ["warn"],
      },
    },
    {
      files: "*.vue",
      rules: {
        "unicorn/consistent-function-scoping": "off",
      },
    },
  ],

  settings: {},
}

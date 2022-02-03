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
    "@typescript-eslint",
    "implicit-dependencies",
  ],

  rules: {
    "implicit-dependencies/no-implicit": [
      "error",
      { peer: true, dev: true, optional: true },
    ],
    semi: ["error", "never"],
    curly: ["warn", "multi-line"],
    "no-console": ["error", { allow: ["warn", "error"] }],
    "no-debugger": "error",

    "no-undef": "off",
    "func-style": ["warn", "expression"],
    "no-async-promise-executor": "off",
    "vue/no-v-html": "off",
    "import/no-cycle": "off",
    "import/no-unresolved": "off",
    "import/named": "off",
    "import/extensions": [
      "error",
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
    "unicorn/prefer-json-parse-buffer": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/prefer-namespace-keyword": "off",
    "@typescript-eslint/no-namespace": 0,
    "@typescript-eslint/explicit-function-return-type": [
      "warn",
      {
        allowHigherOrderFunctions: true,
        allowTypedFunctionExpressions: true,
        allowExpressions: true,
        allowConciseArrowFunctionExpressionsStartingWithVoid: true,
      },
    ], // overridden for .ts files
    "@typescript-eslint/no-use-before-define": "warn", // can cause organization issues
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-var-requires": "off", // overridden for transpiled .ts files
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/member-delimiter-style": "off",
    "no-unused-vars": "off", // use ts one instead
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-unnecessary-type-assertion": "off",

    ...tsLintRules,
  },
  overrides: [
    // {
    //   // enable the rule specifically for TypeScript files
    //   files: ["*.ts", "*.tsx"],
    //   rules: {
    //     "@typescript-eslint/explicit-function-return-type": [
    //       "warn",
    //       {
    //         allowHigherOrderFunctions: true,
    //         allowTypedFunctionExpressions: true,
    //         allowExpressions: true,
    //       },
    //     ],
    //   },
    // },
    {
      files: "*.vue",
      rules: {
        "unicorn/consistent-function-scoping": "off",
      },
    },
  ],

  settings: {},
}

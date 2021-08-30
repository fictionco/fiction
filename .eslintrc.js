module.exports = {
  root: true,
  globals: {
    __dirname: false,
    require: false,
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
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },

  extends: [
    "plugin:unicorn/recommended",
    "plugin:jest/recommended",
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
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
    "no-console": "error",
    "no-debugger": "error",
    "@typescript-eslint/prefer-namespace-keyword": "off",
    "@typescript-eslint/no-namespace": 0,
    "@typescript-eslint/ban-ts-comment": "off",
    "unicorn/no-abusive-eslint-disable": 0,
    "unicorn/prevent-abbreviations": "off",
    "unicorn/filename-case": "off",
    "unicorn/prefer-ternary": "off",
    "unicorn/no-nested-ternary": "off",
    "unicorn/prefer-switch": "off",
    "@typescript-eslint/no-empty-function": "off",

    "no-async-promise-executor": "off",
    "import/no-cycle": 2,

    "import/named": "off",
    "import/extensions": ["warn", "always", { ts: "never", js: "never" }],
    "unicorn/prefer-module": "off",
    "unicorn/no-null": "off",
    "unicorn/no-fn-reference-in-iterator": "off",
    "unicorn/no-useless-undefined": "off",
    "unicorn/no-array-for-each": "off",
    "unicorn/prefer-node-protocol": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off", // come back to this later (2000 errors)
    "@typescript-eslint/explicit-function-return-type": "off", // overridden for .ts files
    "@typescript-eslint/no-use-before-define": "warn", // can cause organization issues
    "func-style": ["warn", "expression"],
    "@typescript-eslint/no-var-requires": "off", // overridden for transpiled .ts files
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/member-delimiter-style": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "vue/no-v-html": "off",
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

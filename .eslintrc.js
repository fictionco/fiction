module.exports = {
  root: true,
  globals: {
    __dirname: false,
    require: false,
    module: false,
    process: false
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    sourceType: "module",
    parser: "@typescript-eslint/parser"
    //  parser: "babel-eslint"
  },
  env: {
    browser: true,
    es6: true,
    node: true,
    "jest/globals": true
  },

  extends: [
    "plugin:vue/recommended",
    "plugin:unicorn/recommended",
    "plugin:jest/recommended",
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended"
  ],

  plugins: [
    "vue",
    "json",
    "prettier",
    "unicorn",
    "import",
    "jest",
    "import",
    "@typescript-eslint"
  ],

  rules: {
    "no-console": "error",
    "no-debugger": "error",
    complexity: 2,
    semi: ["error", "never"],
    "unicorn/no-abusive-eslint-disable": 0,
    "unicorn/prevent-abbreviations": "off",
    "import/no-cycle": 2,
    "import/extensions": ["warn", "always", { ts: "never", js: "never" }],
    "vue/html-self-closing": 0,
    "vue/html-closing-bracket-spacing": "off",
    "vue/multiline-html-element-content-newline": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/max-attributes-per-line": [2, { singleline: 20, multiline: {} }],
    "jest/expect-expect": "off", // annoying
    "@typescript-eslint/explicit-function-return-type": "off", // overridden for .ts files
    "@typescript-eslint/no-use-before-define": "off", // can cause organization issues
    "@typescript-eslint/no-var-requires": "off", // overridden for transpiled .ts files
    "@typescript-eslint/ban-ts-ignore": "off"
  },
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": ["warn"],
        "@typescript-eslint/no-var-requires": "warn",
        "@typescript-eslint/ban-ts-ignore": "warn"
      }
    }
  ],

  settings: {
    "import/resolver": {
      alias: {
        map: [["~", process.env.FACTOR_CWD || process.cwd()]]
      }
    }
  }
}

module.exports = {
  root: true,
  globals: {
    __dirname: false,
    require: false,
    module: false,
    process: false
  },
  parserOptions: {
    sourceType: "module",
    parser: "@typescript-eslint/parser"
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
    "plugin:import/typescript"
    // "plugin:@typescript-eslint/recommended"
  ],

  plugins: [
    "vue",
    "json",
    "prettier",
    "unicorn",
    "import",
    "jest",
    "import"
    //  "@typescript-eslint"
  ],

  rules: {
    "no-console": "error",
    "no-debugger": "error",
    complexity: 2,
    semi: ["error", "never"],
    "unicorn/no-abusive-eslint-disable": 0,
    "unicorn/prevent-abbreviations": "off",
    "import/no-cycle": 1,
    "import/extensions": ["warn", "always", { ts: "never", js: "never" }],
    "vue/html-self-closing": 0,
    "vue/html-closing-bracket-spacing": "off",
    "vue/multiline-html-element-content-newline": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/max-attributes-per-line": [2, { singleline: 20, multiline: {} }],
    "jest/expect-expect": "off" // annoying,
  },

  settings: {
    "import/resolver": {
      alias: {
        map: [["~", process.env.FACTOR_CWD || process.cwd()]]
      }
    }
  }
}

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
    parser: "babel-eslint"
  },
  env: {
    browser: true,
    es6: true,
    node: true,
    "jest/globals": true
  },
  rules: {
    "no-console": "error",
    "no-debugger": "error"
  },

  extends: [
    "plugin:vue/recommended",
    "plugin:unicorn/recommended",
    "plugin:jest/recommended",
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings"
  ],

  plugins: ["vue", "json", "prettier", "unicorn", "import", "jest", "import"],

  rules: {
    complexity: 1,
    semi: ["error", "never"],
    "unicorn/no-abusive-eslint-disable": 0,
    "unicorn/prevent-abbreviations": "off",
    "import/extensions": [
      "error",
      {
        js: "never",
        vue: "never"
      }
    ],
    "vue/html-self-closing": 0,
    "vue/html-closing-bracket-spacing": "off",
    "vue/multiline-html-element-content-newline": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/max-attributes-per-line": [
      2,
      {
        singleline: 20,
        multiline: {}
      }
    ]
  }
}

module.exports = {
  root: true,
  parserOptions: {
    sourceType: "module",
    parser: "babel-eslint"
  },
  globals: {
    __dirname: false,
    require: false,
    module: false,
    process: false
  },
  env: {
    browser: true,
    es6: true,
    node: true
  },

  extends: ["plugin:vue/recommended", "plugin:unicorn/recommended"],

  plugins: ["vue", "json", "prettier", "unicorn", "import"],

  settings: {},

  rules: {
    semi: ["error", "never"],
    "unicorn/prevent-abbreviations": "off",
    "import/extensions": [
      "error",
      {
        js: "never",
        vue: "never"
      }
    ],
    "vue/multiline-html-element-content-newline": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/max-attributes-per-line": [
      2,
      {
        singleline: 5,
        multiline: {}
      }
    ]
  }
}

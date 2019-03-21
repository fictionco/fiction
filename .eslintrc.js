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

  settings: {
    // "import/resolver": {
    //   webpack: {
    //     config: "./build/webpack-config.js"
    //   }
    // }
  },

  rules: {
    semi: ["error", "never"],

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
    // "vue/component-name-in-template-casing": [
    //   "error",
    //   "kebab-case",
    //   {
    //     ignores: []
    //   }
    // ]
  }
}

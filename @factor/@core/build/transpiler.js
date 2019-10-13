module.exports.default = Factor => {
  return new (class {
    constructor() {
      require("@babel/register")(this.config())
    }

    config() {
      return {
        ignore: [
          // **not** compiled if `true` is returned.
          filepath => {
            const modulePath = filepath.includes("node_modules")
              ? filepath.split("node_modules").pop()
              : filepath
            return modulePath.includes("@factor") || !filepath.includes("node_modules")
              ? false
              : true
          }
        ],
        plugins: [
          "@babel/plugin-transform-regenerator",
          "@babel/plugin-transform-runtime",
          "@babel/plugin-syntax-dynamic-import",
          "@babel/plugin-transform-modules-commonjs",
          "@babel/plugin-proposal-object-rest-spread",
          "dynamic-import-node"
        ],
        presets: [
          [
            "@babel/preset-env",
            {
              modules: "cjs"
            }
          ]
        ]
      }
    }
  })()
}

module.exports.default = Factor => {
  return new (class {
    constructor() {
      require("@babel/register")(this.config())
    }

    config() {
      const modules = "cjs"

      let plugins = [
        "@babel/plugin-transform-regenerator",
        "@babel/plugin-transform-runtime",
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-transform-modules-commonjs",
        "@babel/plugin-proposal-object-rest-spread",
        "dynamic-import-node"
      ]

      return {
        ignore: [
          // **not** compiled if `true` is returned.
          function(filepath) {
            const modulePath = filepath.includes("node_modules") ? filepath.split("node_modules").pop() : filepath
            return modulePath.includes("@factor") ? false : true
          }
        ],
        plugins,
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                browsers: ["> 1%", "last 2 versions"]
              },
              modules
            }
          ]
        ]
      }
    }
  })()
}

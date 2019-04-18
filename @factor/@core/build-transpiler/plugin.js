module.exports = Factor => {
  return new class {
    constructor() {}

    register({ target }) {
      require("@babel/register")(this.config({ target }))
    }

    config({ target }) {
      const modules = "cjs"

      let plugins = [
        "@babel/plugin-transform-regenerator",
        "@babel/plugin-transform-runtime",
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-transform-modules-commonjs",
        "@babel/plugin-proposal-object-rest-spread"
      ]

      if (target == "build") {
        plugins = plugins.concat(["dynamic-import-node"])
      }

      return {
        ignore: [
          // **not** compiled if `true` is returned.
          function(filepath) {
            const modulePath = filepath.includes("node_modules")
              ? filepath.split("node_modules").pop()
              : filepath
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
  }()
}

// Return a function since this will need to be called again on server restarts

module.exports = () => {
  // require("@babel/register")({
  //   ignore: [
  //     // **not** compiled if `true` is returned.
  //     filepath => {
  //       const hasNm = filepath.includes("node_modules")
  //       const modulePath = hasNm ? filepath.split("node_modules").pop() : filepath
  //       return modulePath.includes("@factor") || !hasNm ? false : true
  //     }
  //   ],
  //   plugins: [
  //     "@babel/plugin-transform-regenerator",
  //     "@babel/plugin-transform-runtime",
  //     "@babel/plugin-syntax-dynamic-import",
  //     "@babel/plugin-transform-modules-commonjs",
  //     "@babel/plugin-proposal-object-rest-spread",
  //     "dynamic-import-node",
  //     "@babel/plugin-syntax-import-meta"
  //   ],

  //   presets: [["@babel/preset-env", { modules: "cjs" }]],
  //   sourceMaps: "inline"
  // })

  require("ts-node").register({
    transpileOnly: true,
    ignore: [`/node_modules/(?!(@factor|factor))`]
  })
  require.extensions[".md"] = () => {}
  require.extensions[".svg"] = () => {}
  require.extensions[".jpg"] = () => {}
  require.extensions[".png"] = () => {}
  require.extensions[".mp4"] = () => {}
  require.extensions[".vue"] = () => {}
  require.extensions[".css"] = () => {}
  require.extensions[".less"] = () => {}
}

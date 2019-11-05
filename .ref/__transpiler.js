import { resolve, dirname } from "path"

import moduleAlias from "module-alias"

export default () => {
  const { main = "index.js" } = require(resolve(process.env.FACTOR_CWD, "package.json"))

  moduleAlias.addAlias("~", process.env.FACTOR_CWD)
  moduleAlias.addAlias("@", dirname(resolve(process.env.FACTOR_CWD, main)))
  moduleAlias.addAlias("#", dirname(require.resolve("@factor/app")))

  // Transpile to handle import/export
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
  //     "dynamic-import-node"
  //   ],
  //   presets: [["@babel/preset-env", { modules: "cjs" }]]
  // })

  // Assign alias to match webpack

  // Prevent errors on non-JS filetypes that work in webpack (file-loader)
  // require.extensions[".md"] = () => {}
  // require.extensions[".svg"] = () => {}
  // require.extensions[".jpg"] = () => {}
  // require.extensions[".png"] = () => {}
  // require.extensions[".mp4"] = () => {}
  // require.extensions[".vue"] = () => {}
}

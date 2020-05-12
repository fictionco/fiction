// Return a function since this will need to be called again on server restarts

module.exports = () => {
  // https://regex101.com/r/La4C28/1
  const transpileModules = ["@factor", ".*factor", "lodash-es"]
  require("ts-node").register({
    transpileOnly: true,
    compilerOptions: {
      strict: false,
      allowJs: true,
      resolveJsonModule: true,
      moduleResolution: "node",
      module: "commonjs",
      target: "es2018",
      esModuleInterop: true,
      skipLibCheck: true,
    },
    ignore: [`node_modules/(?!(${transpileModules.join("|")}))`],
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

// Return a function since this will need to be called again on server restarts

module.exports = () => {
  require("ts-node").register({
    transpileOnly: true,
    compilerOptions: {
      strict: false
    },
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

const config = {
  entry: "./app/index.ts",
  output: {
    publicUrl: "{BASE_URL}_loading/",
    dir: "app-dist",
    html: {
      template: "app/index.html",
      title: "Under Maintenance",
    },
  },
  configureWebpack: {},
  plugins: [],
}

module.exports = config

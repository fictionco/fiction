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

/**
 * Needed to make URL usable in dev mode
 */
if (process.env.NODE_ENV == "development") {
  config.output = { publicUrl: "/" }
}

module.exports = config

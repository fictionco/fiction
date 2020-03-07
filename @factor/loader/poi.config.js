const env = process.env.NODE_ENV
const config = {
  entry: "./app/index.ts",
  output: {
    publicUrl: "{BASE_URL}_loading/",
    dir: "app-dist",
    html: {
      template: "app/index.html",
      title: "Factor: Loading..."
    }
  }
}

if (env == "development") {
  config.output = { publicUrl: "/" }
}

module.exports = config

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
  },
  configureWebpack: {},
  plugins: [
    // {
    //   resolve: "@poi/plugin-typescript",
    //   options: {
    //     configFile: "./tsconfig.json",
    //     loaderOptions: {
    //       compilerOptions: {
    //         module: "es6",
    //         noEmit: false,
    //         strict: false,
    //         sourceMap: false
    //       }
    //     }
    //   }
    // }
  ]
}

if (env == "development") {
  config.output = { publicUrl: "/" }
}

module.exports = config

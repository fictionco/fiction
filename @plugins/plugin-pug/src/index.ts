import { addFilter } from "@factor/api"

addFilter({
  hook: "webpack-loaders",
  key: "pug-plain-loader",
  callback: (loaders: any[]) => {
    loaders.push({
      test: /\.pug$/,
      loader: "pug-plain-loader",
    })
    return loaders
  },
})

import Factor from "vue"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import webpack from "webpack"
const { NODE_ENV, FACTOR_ENV } = process.env

export function cssLoaders({ target, lang }) {
  const _base = [
    { loader: "css-loader" },
    {
      loader: "postcss-loader",
      options: {
        plugins: [require("cssnano")({ preset: "default" })],
        minimize: true
      }
    }
  ]

  if (lang == "less") {
    _base.push({ loader: "less-loader" })
  } else if (lang == "sass") {
    _base.push({ loader: "sass-loader" })
  }

  const __ = []

  if (NODE_ENV != "production") {
    __.push({ loader: "vue-style-loader" })
  } else if (target == "client" && NODE_ENV == "production") {
    __.push({ loader: MiniCssExtractPlugin.loader })
  } else if (target == "server" && NODE_ENV == "production") {
    __.push({ loader: "null-loader" })
  }

  return [...__, ..._base]
}

export async function enhancedBuild({ name, config }) {
  const compiler = webpack(config)
  var ProgressPlugin = require("webpack/lib/ProgressPlugin")
  const { Bar, Presets } = require("cli-progress")

  let _bar = new Bar({ format: `${name} [{bar}] {percentage}% {msg}` }, Presets.rect)

  return await new Promise((resolve, reject) => {
    _bar.start(100, 1, { msg: "" })

    compiler.apply(new ProgressPlugin((ratio, msg) => _bar.update(ratio * 100, { msg })))

    compiler.run((err, stats) => {
      _bar.stop()

      if (FACTOR_ENV != "test") {
        const s =
          stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
          }) + "\n\n"

        process.stdout.write(s)
      }

      if (err || stats.hasErrors()) reject(err)
      else {
        Factor.$log.success(`[${name}] built`)
        resolve(true)
      }
    })
  })
}

import MiniCssExtractPlugin from "mini-css-extract-plugin"
import webpack from "webpack"
import log from "@factor/tools/logger"
import { applyFilters } from "@factor/tools/filters"

export function cssLoaders({ target, lang }) {
  const postCssPlugins = applyFilters("postcss-plugins", [
    require("cssnano")({ preset: "default" })
  ])

  const _base = [
    { loader: "css-loader" },
    {
      loader: "postcss-loader",
      options: {
        plugins: postCssPlugins,
        minimize: true
      }
    }
  ]

  if (lang == "less") {
    _base.push({ loader: "less-loader" })
  }

  const __ = []

  if (process.env.NODE_ENV != "production") {
    __.push({ loader: "vue-style-loader" })
  } else if (target == "client" && process.env.NODE_ENV == "production") {
    __.push({ loader: MiniCssExtractPlugin.loader })
  } else if (target == "server" && process.env.NODE_ENV == "production") {
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

      if (process.env.FACTOR_ENV != "test") {
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
        log.success(`[${name}] built`)
        resolve(true)
      }
    })
  })
}

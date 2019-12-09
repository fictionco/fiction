import MiniCssExtractPlugin from "mini-css-extract-plugin"
import webpack, { Configuration } from "webpack"
import log from "@factor/api/logger"
import { applyFilters } from "@factor/api/hooks"
import cssNano from "cssnano"
import webpackProgressPlugin from "webpack/lib/ProgressPlugin"
import cliProgress from "cli-progress"

export const cssLoaders = ({ target, lang }: { target: string; lang: string }): object[] => {
  const postCssPlugins = applyFilters("postcss-plugins", [cssNano({ preset: "default" })])

  const _base = [
    { loader: "css-loader" },
    {
      loader: "postcss-loader",
      options: {
        ident: "postcss", // https://github.com/postcss/postcss-loader#plugins
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

export const enhancedBuild = async ({
  name,
  config
}: {
  name: string;
  config: Configuration;
}): Promise<void> => {
  const compiler = webpack(config)

  const { Bar, Presets } = cliProgress

  const _bar = new Bar({ format: `${name} [{bar}] {percentage}% {msg}` }, Presets.rect)

  return await new Promise((resolve, reject) => {
    _bar.start(100, 1, { msg: "" })

    compiler.apply(
      new webpackProgressPlugin((ratio: number, msg: string) =>
        _bar.update(ratio * 100, { msg })
      )
    )

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
        resolve()
      }
    })
  })
}

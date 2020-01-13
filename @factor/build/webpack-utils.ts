import MiniCssExtractPlugin from "mini-css-extract-plugin"

import { applyFilters } from "@factor/api/hooks"
import cssNano from "cssnano"

export const cssLoaders = ({
  target,
  lang,
  cwd
}: {
  target: string;
  lang: string;
  cwd?: string;
}): object[] => {
  const postCssPlugins = applyFilters(
    "postcss-plugins",
    [cssNano({ preset: "default" })],
    { target, lang, cwd }
  )

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

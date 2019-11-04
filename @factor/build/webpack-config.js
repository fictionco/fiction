import "@factor/build/webpack-overrides"
import { applyFilters, addCallback, addFilter, log } from "@factor/tools"
import { CleanWebpackPlugin } from "clean-webpack-plugin"
import { getPath } from "@factor/tools/paths"
import BundleAnalyzer from "webpack-bundle-analyzer"
import CopyPlugin from "copy-webpack-plugin"
import merge from "webpack-merge"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import nodeExternals from "webpack-node-externals"
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin"
import TerserPlugin from "terser-webpack-plugin"
import VueLoaderPlugin from "vue-loader/lib/plugin"
import VueSSRClientPlugin from "vue-server-renderer/client-plugin"
import VueSSRServerPlugin from "vue-server-renderer/server-plugin"
import webpack from "webpack"

import { cssLoaders, enhancedBuild } from "./webpack-utils"

addCallback("create-distribution-app", _ => buildProduction(_))
addFilter("webpack-config", _ => getConfig(_))

export async function buildProduction(_arguments = {}) {
  return await Promise.all(
    ["server", "client"].map(async target => {
      const config = await getConfig({ ..._arguments, target })
      enhancedBuild({ config, name: target })
    })
  )
}

export async function getConfig(_arguments) {
  const { NODE_ENV } = process.env

  let { target, analyze = false, testing = false } = _arguments

  const baseConfig = await base({ target })

  const buildConfig = NODE_ENV == "production" ? production() : development()

  const targetConfig = target == "server" ? server() : client()

  const testingConfig = testing ? { devtool: "", optimization: { minimize: false } } : {}

  const plugins = applyFilters("webpack-plugins", [], { ..._arguments, webpack })

  // Only run this once (server build)
  // If it runs twice it cleans it after the first
  if (NODE_ENV == "production" && target == "server") {
    plugins.push(new CleanWebpackPlugin())
  } else if (target == "client" && analyze) {
    plugins.push(new BundleAnalyzer.BundleAnalyzerPlugin({ generateStatsFile: true }))
  }

  const packageConfig = applyFilters("package-webpack-config", {})

  const config = merge(
    baseConfig,
    buildConfig,
    targetConfig,
    packageConfig,
    testingConfig,
    { plugins }
  )

  return config
}

function server() {
  const entry = getPath("entry-server")

  const filename = "factor-server.json"
  return {
    target: "node",
    entry,
    output: { filename: "server-bundle.js", libraryTarget: "commonjs2" },

    // https://webpack.js.org/configuration/externals/#externals
    // https://github.com/liady/webpack-node-externals
    // do not externalize CSS files in case we need to import it from a dep
    externals: [nodeExternals({ whitelist: [/\.css$/, /factor/] })],
    plugins: [new VueSSRServerPlugin({ filename })]
  }
}

function client() {
  const app = getPath("entry-browser")
  const filename = "factor-client.json"
  return {
    entry: { app },
    plugins: [new VueSSRClientPlugin({ filename })]
  }
}

function production() {
  return {
    mode: "production",
    output: { publicPath: "/" },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "css/[name].[hash].css",
        chunkFilename: "css/[name].[hash].css"
      })
    ],
    performance: { hints: "warning" },
    optimization: {
      minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})]
    }
  }
}

function development() {
  const publicPath = getPath("dist")
  return {
    mode: "development",
    output: { publicPath },
    performance: { hints: false } // Warns about large dev file sizes,
  }
}

async function base(_arguments) {
  const { target } = _arguments

  console.log("WEBPACK T", target)
  const out = {
    output: {
      path: getPath("dist"),
      filename: "js/[name].[chunkhash].js"
    },
    resolve: {
      extensions: [".js", ".vue", ".json"],
      alias: applyFilters("webpack-aliases", {})
    },
    module: {
      rules: applyFilters("webpack-loaders", [
        {
          test: /\.vue$/,
          loader: "vue-loader"
        },

        {
          test: /\.(png|jpg|gif|svg|mov|mp4)$/,
          loader: "file-loader",
          options: { name: "[name].[hash].[ext]" }
        },

        {
          test: /\.css/,
          use: cssLoaders({ target, lang: "css" })
        },
        {
          test: /\.less/,
          use: cssLoaders({ target, lang: "less" })
        },
        {
          test: /\.(scss|sass)/,
          use: cssLoaders({ target, lang: "sass" })
        },

        {
          test: /\.md$/,
          use: [{ loader: "markdown-image-loader" }]
        }
      ])
    },

    plugins: [
      new CopyPlugin(applyFilters("webpack-copy-files-config", [])),
      new VueLoaderPlugin(),
      new webpack.DefinePlugin(
        await applyFilters("webpack-define", {
          "process.env.FACTOR_SSR": JSON.stringify(target),
          "process.env.FACTOR_ENV": JSON.stringify(process.env.FACTOR_ENV),
          "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
          "process.env.VUE_ENV": JSON.stringify(target)
        })
      ),
      function() {
        this.plugin("done", function(stats) {
          const { errors } = stats.compilation
          if (errors && errors.length > 0) log.error(errors)
        })
      }
    ],
    stats: { children: false },
    performance: { maxEntrypointSize: 500000 },
    node: { fs: "empty" }
  }

  // Allow for ignoring of files that should not be packaged for client
  const ignoreMods = applyFilters("webpack-ignore-modules", [])

  if (ignoreMods.length > 0) {
    out.plugins.push(new webpack.IgnorePlugin(new RegExp(`^(${ignoreMods.join("|")})$`)))
  }

  return out
}

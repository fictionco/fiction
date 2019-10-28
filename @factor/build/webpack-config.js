import Factor from "@factor/core"
import webpack from "webpack"
import { cssLoaders, enhancedBuild } from "./webpack-utils"
import { applyFilters } from "@factor/tools"
const merge = require("webpack-merge")

const nodeExternals = require("webpack-node-externals")

const CopyPlugin = require("copy-webpack-plugin")
const VueLoaderPlugin = require("vue-loader/lib/plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")

const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin")
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin")

export default () => {
  return new (class {
    constructor() {
      Factor.$filters.callback("create-distribution-app", _ => this.buildProduction(_))
      addFilter("webpack-config", _ => this.getConfig(_))
    }

    async buildProduction(_arguments = {}) {
      return await Promise.all(
        ["server", "client"].map(target =>
          enhancedBuild({
            config: this.getConfig({ ..._arguments, target }),
            name: target
          })
        )
      )
    }

    getConfig(_arguments) {
      const { NODE_ENV } = process.env

      let { target, analyze = false, testing = false } = _arguments

      const baseConfig = this.base({ target })

      const buildConfig =
        NODE_ENV == "production" ? this.production() : this.development()

      const targetConfig = target == "server" ? this.server() : this.client()

      const testingConfig = testing
        ? { devtool: "", optimization: { minimize: false } }
        : {}

      const plugins = applyFilters("webpack-plugins", [], {
        ..._arguments,
        webpack
      })

      // Only run this once (server build)
      // If it runs twice it cleans it after the first
      if (NODE_ENV == "production" && target == "server") {
        plugins.push(new CleanWebpackPlugin())
      } else if (target == "client" && analyze) {
        plugins.push(new BundleAnalyzerPlugin({ generateStatsFile: true }))
      }

      const packageConfig = applyFilters("package-webpack-config", {})

      const config = merge(
        baseConfig,
        buildConfig,
        targetConfig,
        packageConfig,
        testingConfig,
        {
          plugins
        }
      )

      return config
    }

    server() {
      const entry = Factor.$paths.get("entry-server")

      const filename = "factor-server.json"
      return {
        target: "node",
        entry,
        output: {
          filename: "server-bundle.js",
          libraryTarget: "commonjs2"
        },

        // https://webpack.js.org/configuration/externals/#externals
        // https://github.com/liady/webpack-node-externals
        // do not externalize CSS files in case we need to import it from a dep
        externals: [nodeExternals({ whitelist: [/\.css$/, /factor/] })],
        plugins: [new VueSSRServerPlugin({ filename })]
      }
    }

    client() {
      const app = Factor.$paths.get("entry-client")
      const filename = "factor-client.json"
      return {
        entry: { app },
        plugins: [new VueSSRClientPlugin({ filename })]
      }
    }

    production() {
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

    development() {
      const publicPath = Factor.$paths.get("dist")
      return {
        mode: "development",
        output: { publicPath },
        performance: { hints: false } // Warns about large dev file sizes,
      }
    }

    base(_arguments) {
      const { target } = _arguments
      const out = {
        output: {
          path: Factor.$paths.get("dist"),
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
            applyFilters("webpack-define", {
              "process.env.FACTOR_SSR": JSON.stringify(target),
              "process.env.FACTOR_ENV": JSON.stringify(process.env.FACTOR_ENV),
              "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
              "process.env.VUE_ENV": JSON.stringify(target)
            })
          ),
          function() {
            this.plugin("done", function(stats) {
              const { errors } = stats.compilation
              if (errors && errors.length > 0) console.error(errors)
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
        out.plugins.push(
          new webpack.IgnorePlugin(new RegExp(`^(${ignoreMods.join("|")})$`))
        )
      }

      return out
    }
  })()
}

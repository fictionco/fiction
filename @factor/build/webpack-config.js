import "@factor/build/webpack-overrides"
import { applyFilters, log, ensureTrailingSlash } from "@factor/tools"
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

export async function buildProductionApp(_arguments = {}) {
  return await Promise.all(
    ["server", "client"].map(async (target, index) => {
      const clean = index === 0
      const config = await getWebpackConfig({ ..._arguments, target, clean })

      return await enhancedBuild({ config, name: target })
    })
  )
}

export async function getWebpackConfig(_arguments) {
  let { target, analyze = false, testing = false, clean = false } = _arguments

  const baseConfig = await base({ target })

  const buildConfig = process.env.NODE_ENV == "production" ? production() : development()

  const targetConfig = target == "server" ? server() : client()

  const testingConfig = testing
    ? { devtool: "source-map", optimization: { minimize: false } }
    : {}

  const debugConfig = process.env.FACTOR_DEBUG ? { devtool: "source-map" } : {}

  const plugins = applyFilters("webpack-plugins", [], { ..._arguments })

  // Only run this once (server build)
  // If it runs twice it cleans it after the first
  if (clean) {
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
    debugConfig,
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
  const entry = getPath("entry-browser")
  const filename = "factor-client.json"
  return {
    entry,
    plugins: [new VueSSRClientPlugin({ filename })]
  }
}

function production() {
  return {
    mode: "production",
    output: { publicPath: "/" },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "css/[name]-[hash:5].css",
        chunkFilename: "css/[name]-[hash:5].css"
      })
    ],
    performance: { hints: "warning" },
    optimization: {
      minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})]
    }
  }
}

function development() {
  // Apparently webpack expects a trailing slash on these
  const publicPath = ensureTrailingSlash(getPath("dist"))
  return {
    mode: "development",
    output: { publicPath },
    performance: { hints: false } // Warns about large dev file sizes,
  }
}

async function base(_arguments) {
  const { target } = _arguments

  const out = {
    output: {
      path: getPath("dist"),
      filename: "js/[name].[hash:5].js"
    },
    resolve: {
      extensions: [".js", ".vue", ".json"],
      alias: applyFilters("webpack-aliases", {})
    },
    module: {
      rules: applyFilters("webpack-loaders", [
        { test: /\.vue$/, loader: "vue-loader" },
        {
          test: /\.(png|jpg|gif|svg|mov|mp4)$/,
          loader: "file-loader",
          options: { name: "[name]-[hash:5].[ext]" }
        },
        { test: /\.css/, use: cssLoaders({ target, lang: "css" }) },
        { test: /\.less/, use: cssLoaders({ target, lang: "less" }) },
        { test: /\.md$/, use: [{ loader: "markdown-image-loader" }] }
      ])
    },

    plugins: [
      new CopyPlugin(applyFilters("webpack-copy-files-config", [])),
      new VueLoaderPlugin(),
      new webpack.DefinePlugin(
        await applyFilters("webpack-define", {
          "process.env.FACTOR_SSR": JSON.stringify(target),
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

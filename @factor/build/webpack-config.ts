import "@factor/build/webpack-overrides"
import { applyFilters, log, ensureTrailingSlash, deepMerge } from "@factor/tools"
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
import webpack, { Configuration, Stats, Compiler } from "webpack"

import WebpackDeepScopeAnalysisPlugin from "webpack-deep-scope-plugin"
import { configSettings } from "@factor/tools/config"
import { generateLoaders } from "@factor/cli/extension-loader"
import { cssLoaders, enhancedBuild } from "./webpack-utils"

interface FactorBundleOptions {
  config?: Record<string, any>;
  beforeCompile?: (_arguments: any) => {};
  afterCompile?: (_arguments: any) => {};
}

interface FactorWebpackConfig {
  target?: string;
  analyze?: boolean;
  testing?: boolean;
  clean?: boolean;
}

export async function generateBundles(options: FactorBundleOptions = {}): Promise<void> {
  generateLoaders()

  await Promise.all(
    ["server", "client"].map(async (target, index) => {
      const clean = index === 0
      const config = await getWebpackConfig({ ...options, target, clean })

      const compiler = webpack(deepMerge([config, options.config || {}]))

      if (options.beforeCompile)
        options.beforeCompile({ compiler, config, target, index })

      await new Promise((resolve, reject) => {
        compiler.run((error, stats) => {
          if (error || stats.hasErrors()) reject(error)
          else {
            if (options.afterCompile) {
              options.afterCompile({ compiler, error, stats, config, target, index })
            }

            resolve(true)
          }
        })
      })

      return
    })
  )
}

export async function buildProductionApp(_arguments = {}): Promise<void[]> {
  return await Promise.all(
    ["server", "client"].map(async (target, index) => {
      const clean = index === 0
      const config = await getWebpackConfig({ ..._arguments, target, clean })

      return await enhancedBuild({ config, name: target })
    })
  )
}

export async function getWebpackConfig(
  _arguments: FactorWebpackConfig
): Promise<Configuration> {
  const {
    target = "server",
    analyze = false,
    testing = false,
    clean = false
  } = _arguments

  const baseConfig = await base({ target })

  const buildConfig = process.env.NODE_ENV == "production" ? production() : development()

  const targetConfig = target == "server" ? server() : client()

  const testingConfig: Configuration =
    testing || process.env.FACTOR_DEBUG ? { devtool: "source-map" } : {}

  const plugins = applyFilters("webpack-plugins", [], { ..._arguments })

  // Only run this once (server build)
  // If it runs twice it cleans it after the first
  if (clean) {
    plugins.push(new CleanWebpackPlugin())
  } else if (analyze) {
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

function server(): Configuration {
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

function client(): Configuration {
  const entry = getPath("entry-browser")
  const filename = "factor-client.json"
  return {
    entry,
    plugins: [new VueSSRClientPlugin({ filename })]
  }
}

function production(): Configuration {
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

function development(): Configuration {
  // Apparently webpack expects a trailing slash on these
  const publicPath = ensureTrailingSlash(getPath("dist"))
  return {
    mode: "development",
    output: { publicPath },
    performance: { hints: false } // Warns about large dev file sizes,
  }
}

async function base({ target }: { target: string }): Promise<Configuration> {
  const out = {
    output: {
      path: getPath("dist"),
      filename: "js/[name].[hash:5].js"
    },
    resolve: {
      extensions: [".js", ".vue", ".json", ".ts"],
      alias: applyFilters("webpack-aliases", {})
    },
    module: {
      rules: applyFilters("webpack-loaders", [
        { test: /\.vue$/, loader: "vue-loader" },
        {
          test: /\.(png|jpg|gif|svg|mov|mp4)$/,
          loader: "file-loader",
          // esModule option introduced in v5, but breaks markdown-image-loader
          options: { name: "[name]-[hash:5].[ext]", esModule: false }
        },
        { test: /\.css/, use: cssLoaders({ target, lang: "css" }) },
        { test: /\.less/, use: cssLoaders({ target, lang: "less" }) },
        { test: /\.md$/, use: [{ loader: "markdown-image-loader" }] },
        {
          test: /\.ts$/,
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            appendTsSuffixTo: [/\.vue$/],
            compilerOptions: {
              noEmit: false,
              strict: false,
              sourceMap: false
            }
          }
        }
      ])
    },

    plugins: [
      new WebpackDeepScopeAnalysisPlugin.default(),
      new CopyPlugin(applyFilters("webpack-copy-files-config", [])),
      new VueLoaderPlugin(),
      new webpack.DefinePlugin(getDefinedValues(target)),
      function(this: Compiler): void {
        this.plugin("done", function(stats: Stats) {
          const { errors } = stats.compilation
          if (errors && errors.length > 0) log.error(errors)
        })
      }
    ],
    stats: { children: false },

    performance: { maxEntrypointSize: 500000 }
  }

  // Allow for ignoring of files that should not be packaged for client
  const ignoreMods = applyFilters("webpack-ignore-modules", [])

  if (ignoreMods.length > 0) {
    out.plugins.push(new webpack.IgnorePlugin(new RegExp(`^(${ignoreMods.join("|")})$`)))
  }

  return out
}

export function getDefinedValues(target: string): object {
  return applyFilters("webpack-define", {
    "process.env.FACTOR_SSR": JSON.stringify(target),
    "process.env.VUE_ENV": JSON.stringify(target),
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    "process.env.FACTOR_ENV": JSON.stringify(process.env.FACTOR_ENV),
    "process.env.FACTOR_APP_CONFIG": JSON.stringify(configSettings())
  })
}

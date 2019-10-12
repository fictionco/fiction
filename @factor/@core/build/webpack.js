const path = require("path")

const merge = require("webpack-merge")
const webpack = require("webpack")
const nodeExternals = require("webpack-node-externals")

const CopyPlugin = require("copy-webpack-plugin")
const VueLoaderPlugin = require("vue-loader/lib/plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")

const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin")
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin")
//const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")

export default Factor => {
  const { NODE_ENV } = process.env
  return new (class {
    constructor() {
      Factor.$filters.callback("create-distribution-app", _ => this.buildProduction(_))
      Factor.$filters.add("webpack-config", args => this.getConfig(args))
    }

    augmentBuild(name, compiler, { resolve, reject }) {
      var ProgressPlugin = require("webpack/lib/ProgressPlugin")
      const { Bar, Presets } = require("cli-progress")

      let _bar = new Bar({ format: `${name} [{bar}] {percentage}% {msg}` }, Presets.rect)

      _bar.start(100, 1, { msg: "" })

      compiler.apply(
        new ProgressPlugin((ratio, msg) => {
          _bar.update(ratio * 100, { msg })
        })
      )

      compiler.run((err, stats) => {
        _bar.stop()

        if (process.env.FACTOR_ENV != "test") {
          process.stdout.write(
            stats.toString({
              colors: true,
              modules: false,
              children: false,
              chunks: false,
              chunkModules: false
            }) + "\n\n"
          )
        }

        if (err || stats.hasErrors()) reject(Factor.$log.error(err))
        else resolve(Factor.$log.success(`[${name}] Built`))
      })
    }

    async buildProduction(args) {
      try {
        const serverConfig = this.getConfig({
          ...args,
          build: "production",
          target: "server"
        })

        await new Promise((resolve, reject) => {
          const serverCompiler = webpack(serverConfig)
          this.augmentBuild("Building Server Files", serverCompiler, { resolve, reject })
        })

        const clientConfig = this.getConfig({
          ...args,
          build: "production",
          target: "client"
        })

        await new Promise((resolve, reject) => {
          const clientCompiler = webpack(clientConfig)
          this.augmentBuild("Building Browser Files", clientCompiler, { resolve, reject })
        })

        return
      } catch (error) {
        Factor.$log.error(error)
      }
    }

    getConfig(args) {
      let { target, build, analyze = false, testing = false } = args

      const baseConfig = this.base(args)

      const buildConfig = build == "production" ? this.production() : this.development()

      const targetConfig = target == "server" ? this.server() : this.client()

      const testingConfig = testing
        ? {
            devtool: "",
            optimization: {
              minimize: false
            }
          }
        : {}

      // Only run this once (server build)
      // If it runs twice it cleans it after the first
      const plugins = Factor.$filters.apply("webpack-plugins", [], { ...args, webpack })

      //analyze = true
      if (build == "production" && target == "server") {
        plugins.push(new CleanWebpackPlugin())
      } else if (target == "client" && analyze) {
        plugins.push(new BundleAnalyzerPlugin({ generateStatsFile: true }))
      }

      const packageConfig = Factor.$filters.apply("package-webpack-config", {})

      const merged = merge(
        baseConfig,
        buildConfig,
        targetConfig,
        packageConfig,
        testingConfig,
        {
          plugins
        }
      )

      //const smp = new SpeedMeasurePlugin()

      return merged
    }

    server() {
      // Necessary to accomodate issues with resolution in SSR
      // Many packages don't fully consider it  (firebase)
      const alias = Factor.$filters.apply("webpack-aliases-server", {})

      return {
        target: "node",
        entry: Factor.$paths.get("entry-server"),
        output: {
          filename: "server-bundle.js",
          libraryTarget: "commonjs2"
        },
        resolve: { alias },
        // https://webpack.js.org/configuration/externals/#externals
        // https://github.com/liady/webpack-node-externals
        externals: [
          nodeExternals({
            // do not externalize CSS files in case we need to import it from a dep
            whitelist: [/\.css$/, /factor/]
          })
        ],
        plugins: [
          new VueSSRServerPlugin({
            filename: Factor.$paths.get("server-bundle-name")
          })
        ]
      }
    }

    client() {
      return {
        entry: {
          app: Factor.$paths.get("entry-client")
        },

        plugins: [
          new VueSSRClientPlugin({
            filename: Factor.$paths.get("client-manifest-name")
          })
        ]
      }
    }

    production() {
      return {
        mode: "production",
        devtool: "source-map",
        output: { publicPath: "/" },
        plugins: [
          new MiniCssExtractPlugin({
            filename: "css/[name].[hash].css",
            chunkFilename: "css/[name].[hash].css"
          })
        ],
        performance: {
          hints: "warning"
        },
        optimization: {
          minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})]
        }
      }
    }

    development() {
      return {
        mode: "development",
        devtool: "cheap-module-eval-source-map",
        output: {
          publicPath: Factor.$paths.get("dist")
        },
        module: {},
        plugins: [],
        performance: { hints: false } // Warns about large dev file sizes,
      }
    }

    base(args) {
      const out = {
        output: {
          path: Factor.$paths.get("dist"),
          filename: "js/[name].[chunkhash].js"
        },
        resolve: {
          extensions: [".js", ".vue", ".json"],
          alias: Factor.$paths.getAliases()
        },
        module: {
          rules: Factor.$filters.apply("webpack-loaders", [
            {
              test: /\.vue$/,
              loader: "vue-loader"
            },

            {
              test: /\.(png|jpg|gif|svg)$/,
              loader: "file-loader",
              options: { limit: 10000, name: "[name].[hash].[ext]" }
            },
            { test: /\.(mov|mp4)$/, use: ["file-loader"] },

            {
              test: /\.css/,
              use: this.cssLoaders({ ...args, lang: "css" })
            },
            {
              test: /\.less/,
              use: this.cssLoaders({ ...args, lang: "less" })
            },
            {
              test: /\.(scss|sass)/,
              use: this.cssLoaders({ ...args, lang: "sass" })
            },

            {
              test: /\.md$/,
              use: [{ loader: "markdown-image-loader" }]
            }
          ])
        },

        plugins: [
          new CopyPlugin(Factor.$filters.apply("webpack-copy-files-config", [])),
          new VueLoaderPlugin(),
          new webpack.DefinePlugin(
            Factor.$filters.apply("webpack-define", {
              "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
              "process.env.VUE_ENV": JSON.stringify(args.target),
              "process.env.FACTOR_SSR": JSON.stringify(args.target)
            })
          ),
          function() {
            this.plugin("done", function(stats) {
              if (stats.compilation.errors && stats.compilation.errors.length > 0) {
                console.log(stats.compilation.errors)
              }
            })
          }
        ],
        stats: { children: false },
        performance: { maxEntrypointSize: 500000 },
        node: { fs: "empty" }
      }

      // Allow for ignoring of files that should not be packaged for client
      const ignoreMods = Factor.$filters.apply("webpack-ignore-modules", [])
      const ignoreRegex = ignoreMods.length > 0 ? ignoreMods.join("|") : ""

      if (ignoreRegex) {
        out.plugins.push(new webpack.IgnorePlugin(new RegExp(`^(${ignoreRegex})$`)))
      }

      return out
    }

    cssLoaders({ target, build, lang }) {
      let finishing

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

      // For development use runtime style loader
      if (build != "production") {
        finishing = [{ loader: "vue-style-loader" }]
      }
      // For production builds, extract css to own file
      else if (target == "client" && build == "production") {
        finishing = [{ loader: MiniCssExtractPlugin.loader }]
      }
      // SSR builds can't have extracted css (causes error)
      else if (target == "server" && build == "production") {
        finishing = [{ loader: "null-loader" }]
      }

      return [...finishing, ..._base]
    }
  })()
}

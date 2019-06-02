const { dirname, resolve } = require("path")
const { pathExistsSync } = require("fs-extra")
const glob = require("glob").sync
module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.themes = Factor.$files.getExtended("theme")

      Factor.$filters.add("webpack-aliases", _ => {
        _["@theme"] =
          this.themes.length > 0 ? dirname(require.resolve(this.themes[0].name)) : Factor.$paths.get("source")

        return _
      })

      // This allows for overriding of files from themes
      // Notes:
      // - Uses "#" as a flag to check a file, this is an alias for the theme root. The function replaces this with the app root.
      // - TODO if a file is added to app, then server needs a restart, fix should be possible
      Factor.$filters.add("webpack-plugins", (_, { webpack }) => {
        const plugin = new webpack.NormalModuleReplacementPlugin(/^\#/, resource => {
          const req = resource.request
          const src = Factor.$paths.get("source")

          const appPath = this._fileExists(req.replace("#", src))

          if (appPath) {
            resource.request = appPath
          } else {
            let filePath = ""
            if (this.themes.length > 0) {
              this.themes.some(_ => {
                const t = dirname(require.resolve(_.name))

                const r = req.replace("#", t)
                const exists = this._fileExists(r)

                if (exists) {
                  filePath = r
                  return true
                }
              })
            }

            if (!filePath) {
              const relPath = this._fileExists(req.replace("#", resource.context))

              const fallbackPath = this._fileExists(req.replace("#", Factor.$paths.get("fallbacks")))

              if (relPath) filePath = relPath
              else if (fallbackPath) filePath = fallbackPath
            }

            resource.request = filePath
          }
        })

        _.push(plugin)
        return _
      })
    }

    _fileExists(path) {
      const basePath = path.split("?")[0]
      const query = path.split("?")[1] || ""
      if (query && pathExistsSync(basePath)) {
        return path
      } else {
        const files = glob(`${basePath}.*`)

        if (files && files.length == 1) {
          return files[0]
        } else {
          return false
        }
      }
    }
  })()
}

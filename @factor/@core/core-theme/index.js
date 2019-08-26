const { dirname, basename, resolve } = require("path")
const { pathExistsSync } = require("fs-extra")
const glob = require("glob").sync
const findUp = require("find-up").sync

module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.themes = Factor.$files.getExtended("theme")

      Factor.$filters.add("webpack-aliases", _ => {
        _["@theme"] =
          this.themes.length > 0
            ? dirname(require.resolve(this.themes[0].name))
            : Factor.$paths.get("source")

        return _
      })

      // This allows for overriding of files from themes
      // Notes:
      // - Uses "#" as a flag to check a file, this is an alias for the theme root. The function replaces this with the app root.
      // - TODO if a file is added to app, then server needs a restart, fix should be possible
      Factor.$filters.add("webpack-plugins", (_, { webpack }) => {
        _.push(this.modulePathWebpackPlugin(webpack))
        return _
      })
    }

    modulePathWebpackPlugin(webpack) {
      return new webpack.NormalModuleReplacementPlugin(/^\#/, resource => {
        // if (resource.request.includes("#setting")) {
        //   const regex = /(?<=\#setting.)(.*?)(?=\/)/gim
        //   console.log(resource.request.match(regex))
        //   return Factor.$setting.get("highlightCode.style")
        // } else {

        // }

        resource.request = this.handleAsOverride(resource)
      })
    }

    handleAsOverride(resource) {
      //const inApp = this.findInDirectory({ directory: src, fileName })
      const inApp = this._fileExists(
        resource.request.replace("#", Factor.$paths.get("source"))
      )
      let filePath = ""
      if (inApp) {
        filePath = inApp
      } else {
        if (this.themes.length > 0) {
          this.themes.some(_ => {
            const themeSrc = dirname(require.resolve(_.name))
            // const inTheme = this.findInDirectory({ fileName, directory: themeSrc })

            const inTheme = this._fileExists(resource.request.replace("#", themeSrc))

            if (inTheme) {
              filePath = inTheme
              return true
            }
          })
        }

        if (!filePath) {
          const relPath = this._fileExists(
            resource.request.replace("#", resource.context)
          )

          const fallbackPath = this._fileExists(
            resource.request.replace("#", Factor.$paths.get("fallbacks"))
          )

          if (relPath) filePath = relPath
          else if (fallbackPath) filePath = fallbackPath
        }
      }

      return filePath ? filePath : resource.request
    }

    findInDirectory({ directory, fileName }) {
      //const baseFileName = fileName.substr(0, fileName.lastIndexOf("."))
      //console.log("baseFileName", baseFileName)
      const files = glob(`${directory}/**/${fileName}`)
      return files && files.length > 0 ? files[0] : false
    }

    _fileExists(path) {
      const basePath = path.split("?")[0]
      //const query = path.split("?")[1] || ""
      if (pathExistsSync(basePath)) {
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

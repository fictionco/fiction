const { ensureDirSync, emptyDirSync, copySync, writeFileSync } = require("fs-extra")

const glob = require("glob").sync

const { resolve, basename, dirname } = require("path")

export default Factor => {
  return new (class {
    constructor() {
      this.folderName = "cloud"
      this.relativeDir = `cloud`

      Factor.$filters.add("webpack-ignore-modules", _ => {
        _.push(this.relativeDir)
        return _
      })

      Factor.$stack.cover({
        provider: "firebase",
        description: "Uses 'firebase serve' and creates local emulator",
        id: "endpoint-emulator"
      })
      // Don't create folder if required credentials aren't setup
      const { databaseURL, serviceAccount } = Factor.$config.setting("firebase") || {}

      if (!databaseURL || !serviceAccount) {
        console.log(
          "Couldn't start Firebase functions. Missing API credentials (Run 'factor setup')",
          Factor.$config.setting("firebase")
        )
        return
      }

      this.addFirebaseConfig()

      this.buildDirectory = resolve(Factor.$paths.get("app"), this.folderName)

      this.cloudPackages = require(Factor.$paths.get("plugins-loader-cloud"))

      this.dependencies = {}
      this.localDependencies = {}

      Factor.$filters.add("cli-runners", _ => {
        _.push({
          command: `npx firebase use ${Factor.$config.setting("env")} && npx firebase serve`,
          name: "Endpoints"
        })
        return _
      })

      Factor.$filters.add("cli-tasks", _ => {
        _.push({
          command: (ctx, task) => {
            this.buildCloudFolder()
            task.title = "Cloud folder built"
          },
          title: "Building Endpoint Folder"
        })

        _.push({
          command: "yarn",
          args: ["install", "--ignore-engines"],
          title: "Installing endpoint packages",
          options: {
            cwd: `${process.cwd()}/${this.relativeDir}`,
            done: "Installed endpoint packages"
          }
        })

        return _
      })

      Factor.$filters.add("build-watchers", _ => {
        _.push({
          name: "Cloud Functions Rebuild",
          files: this._getWatchPaths(),
          callback: ({ event, path }) => {
            this.makePackages()
          }
        })
        return _
      })
    }

    builder() {
      this.buildCloudFolder()
    }

    addFirebaseConfig() {
      Factor.$filters.add("firebase-config", _ => {
        _.hosting = _.hosting || {}

        _.hosting.rewrites = [
          {
            source: "**",
            function: "server"
          }
        ]

        _.functions = {
          source: this.relativeDir
        }

        return _
      })
    }

    buildCloudFolder() {
      this.clearBuildDirectory()
      this.copyAppDirectories()
      this.makePackages()
      this.copyFunctionsFiles()
    }

    clearBuildDirectory() {
      ensureDirSync(this.buildDirectory)

      // Delete everything except for node modules to prevent this reinstalling with every new dev instance
      require("del").sync([
        `${this.buildDirectory}/**`,
        `!${this.buildDirectory}`,
        `!${this.buildDirectory}/node_modules`,
        `!${this.buildDirectory}/yarn.lock`
      ])
    }

    copyAppDirectories() {
      const files = glob(resolve(Factor.$paths.get("app"), "*"), {
        ignore: ["**/node_modules", "**/package.json", `**/${this.folderName}`]
      })

      files.forEach(f => {
        copySync(f, resolve(this.buildDirectory, basename(f)))
      })
    }

    getDependencies() {
      let baseDependencies = {}

      this.cloudPackages.forEach(({ name, version }) => {
        baseDependencies[name] = `^${version}`
      })

      this._recursiveDeps(baseDependencies)
    }

    _recursiveDeps(packages = {}) {
      Object.keys(packages).forEach(packageName => {
        if (packageName.includes("factor")) {
          if (!this.localDependencies[packageName]) {
            this.localDependencies[packageName] = this._localModule(packageName, "./factor_modules/")

            const packagePath = `${packageName}/package.json`
            const deps = require(packagePath).dependencies
            if (deps) {
              this._recursiveDeps(deps)
            }
          }
        } else {
          this.dependencies[packageName] = packages[packageName]
        }
      })
    }

    _getWatchPaths() {
      const watchPaths = [Factor.$paths.get("config-file-public"), Factor.$paths.get("config-file-private")]
      this.getDependencies()

      Object.keys(this.localDependencies).forEach(name => {
        const modPath = dirname(require.resolve(`${name}/package.json`))
        watchPaths.push(`${modPath}/**`)
      })

      return watchPaths
    }

    _copyLocalDeps(localDependencies) {
      Object.keys(localDependencies).forEach(packageName => {
        const packagePath = `${packageName}/package.json`

        const modPath = dirname(require.resolve(packagePath))
        const modDest = resolve(this.buildDirectory, "factor_modules", packageName)

        ensureDirSync(modDest)
        emptyDirSync(modDest)
        copySync(modPath, modDest, { dereference: true })

        // Yarn/NPM just copy the locals to node_modules
        // Need to update that as well for local dev
        const modDestNode = resolve(this.buildDirectory, "node_modules", packageName)

        ensureDirSync(modDestNode)
        emptyDirSync(modDestNode)
        copySync(modPath, modDestNode, { dereference: true })

        const destPackage = `${modDest}/package.json`
        let newPackage = require(destPackage)

        if (newPackage.dependencies) {
          Object.keys(newPackage.dependencies).forEach(packageName => {
            if (packageName.includes("@factor")) {
              newPackage.dependencies[packageName] = this._localModule(packageName, "../../")
            }
          })
        }

        writeFileSync(destPackage, JSON.stringify(newPackage, null, 4))
      })
    }

    _localModule(packageName, relation) {
      return `file:${relation}${packageName}`
    }

    async makePackages() {
      this.getDependencies()

      const { version } = require(resolve(Factor.$paths.get("app"), "package.json"))

      const lines = {
        name: "@factor/cloud-directory",
        description: "************ GENERATED FILE ************",
        version,
        license: "GPL-3.0",
        scripts: {
          deps: "yarn install --ignore-engines"
        },
        engines: { node: "10" },
        dependencies: {
          "firebase-admin": "^7.4.0",
          "firebase-functions": "^2.3.1",
          "@firebase/app-types": "^0.4.0",
          ...this.localDependencies
        },
        devDependencies: {
          "firebase-functions-test": "~0.1.6"
        },
        timestamp: +new Date()
      }

      writeFileSync(`${this.buildDirectory}/package.json`, JSON.stringify(lines, null, "  "))

      this._copyLocalDeps(this.localDependencies)
    }

    copyFunctionsFiles() {
      copySync(resolve(__dirname, "files"), this.buildDirectory)
      copySync(resolve(Factor.$paths.get("app"), ".firebaserc"), resolve(this.buildDirectory, ".firebaserc.json"))
    }
  })()
}

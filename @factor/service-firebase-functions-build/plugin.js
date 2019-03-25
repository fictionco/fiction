const { ensureDirSync, emptyDirSync, copy, copySync, writeFileSync } = require("fs-extra")

const glob = require("glob").sync
const consola = require("consola")
const { resolve, basename, dirname } = require("path")
const execa = require("execa")
export default Factor => {
  return new class {
    constructor() {
      this.folderName = "serverless"

      this.buildDirectory = resolve(Factor.$paths.get("app"), this.folderName)

      this.relativeDir = `${this.folderName}`

      this.serverlessPackages = require(Factor.$paths.get("plugins-loader-serverless"))
      this.buildFunctionsFolder()
      this.addConfig()
    }

    addConfig() {
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

    buildFunctionsFolder() {
      this.copyAppDirectories()
      this.makePackageJson()
      this.copyFunctionsFiles()
      this.runtimeFile()
      // this.transpile()
    }

    copyAppDirectories() {
      const files = glob(resolve(Factor.$paths.get("app"), "*"), {
        ignore: ["**/node_modules", "**/package.json", "**/start.js", `**/${this.folderName}`]
      })

      ensureDirSync(this.buildDirectory)
      emptyDirSync(this.buildDirectory)
      files.forEach(f => {
        copySync(f, resolve(this.buildDirectory, basename(f)))
      })
    }

    getDependencies() {
      let baseDependencies = {}

      Object.values(this.serverlessPackages).forEach(pkg => {
        baseDependencies[pkg.module] = `>${pkg.version}`
      })

      this.dependencies = {}
      this.localDependencies = {}

      this._recursiveDeps(baseDependencies)
    }

    _copyLocalDeps(localDependencies) {
      Object.keys(localDependencies).forEach(packageName => {
        const packagePath = `${packageName}/package.json`

        const modPath = dirname(require.resolve(packagePath))
        const modDest = resolve(this.buildDirectory, "factor_modules", packageName)
        ensureDirSync(modDest)
        copySync(modPath, modDest, { dereference: true })

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
    _recursiveDeps(packages = {}) {
      Object.keys(packages).forEach(packageName => {
        if (packageName.includes("@factor")) {
          if (!this.localDependencies[packageName]) {
            this.localDependencies[packageName] = this._localModule(
              packageName,
              "./factor_modules/"
            )

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

    async makePackageJson() {
      this.getDependencies()

      const { pkg } = Factor.$config
      const babelCliPlugins = "--plugins=babel-plugin-dynamic-import-node"
      const lines = {
        name: "@factor/serverless-directory",
        description: "** GENERATED FILE **",
        version: pkg.version,
        license: "UNLICENSED",
        scripts: {
          deps: "yarn install --ignore-engines",
          transpile: `npx babel src --out-dir src --ignore node_modules,dist,build ${babelCliPlugins}`
        },
        engines: { node: "8" },
        dependencies: this.localDependencies,
        devDependencies: {
          "@babel/cli": "^7.0.0"
        }
      }

      writeFileSync(`${this.buildDirectory}/package.json`, JSON.stringify(lines, null, 4))
      consola.success("Serverless Package.json Generated")
    }

    copyFunctionsFiles() {
      copySync(resolve(__dirname, "files"), this.buildDirectory)
    }

    showOutput(name, runner) {
      let messages = []
      let logType = "success"
      return new Promise((resolve, reject) => {
        runner.stdout.on("data", function(data) {
          messages.push(data.toString())
        })
        runner.stderr.on("data", function(data) {
          messages.push(data.toString())
        })
        runner.on("close", code => {
          messages.push(`${name} Exited with Code ${code}`)
          messages.unshift(`${name} >>>`)
          consola[logType](messages.join(`\n`))
          resolve()
        })
      })
    }

    runtimeFile() {
      this._copyLocalDeps(this.localDependencies)
      // Package.json is still getting generated (apparently)
      // Yarn/NPM will use parent package.json if the CWD one is missing
      setTimeout(async () => {
        const { spawn, exec } = require("child_process")

        const runFolder = `${process.cwd()}/${this.relativeDir}`

        const runner = spawn("yarn", ["deps"], {
          cwd: runFolder
        })

        await this.showOutput("Install Serverless Packages", runner)
      }, 1000)
    }

    // transpile() {
    //   const transpiler = spawn("yarn", ["transpile"], {
    //     cwd: `${process.cwd()}/${this.folderName}`
    //   })

    //   this.showOutput("Transpile", transpiler)
    // }
  }()
}

const { ensureDirSync, emptyDirSync, copy, copySync, writeFileSync } = require("fs-extra")
const { spawnSync, spawn } = require("child_process")
const glob = require("glob").sync
const consola = require("consola")
const { resolve, basename, dirname } = require("path")
export default Factor => {
  return new class {
    constructor() {
      this.folderName = "serverless"
      this.applicationPath = Factor.$paths.get("app")
      this.buildDirectory = resolve(this.applicationPath, this.folderName)

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
            function: "ssr"
          }
        ]

        _.functions = {
          source: this.folderName,
          ignore: ["**/node_modules/!(*factor)/**"]
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
      const files = glob(resolve(this.applicationPath, "*"), {
        ignore: ["**/node_modules", "**/package.json", "**/start.js", `**/${this.folderName}`]
      })

      ensureDirSync(this.buildDirectory)
      emptyDirSync(this.buildDirectory)
      files.forEach(f => {
        copySync(f, resolve(this.buildDirectory, basename(f)))
      })
    }

    getDependencies() {
      let out = {}

      Object.values(this.serverlessPackages).forEach(pkg => {
        const p = require(`${pkg.module}/package.json`)
        if (p.dependencies) {
          out = { ...out, ...p.dependencies }
        }

        //out[pkg.module] = `^${pkg.version}`
      })
      return out
    }

    async copyLocalDeps() {
      Object.values(this.serverlessPackages).forEach(pkg => {
        const modPath = dirname(require.resolve(`${pkg.module}/package.json`))
        const modDest = resolve(this.buildDirectory, "node_modules", pkg.module)
        ensureDirSync(modDest)
        copySync(modPath, modDest)
      })

      return
    }

    async makePackageJson() {
      const dependencies = this.getDependencies()
      await this.copyLocalDeps()

      const { pkg } = Factor.$config
      const babelCliPlugins = "--plugins=babel-plugin-dynamic-import-node"
      const lines = {
        name: "@factor/serverless-directory",
        description: "** GENERATED FILE **",
        version: pkg.version,
        license: "UNLICENSED",
        scripts: {
          transpile: `npx babel src --out-dir src --ignore node_modules,dist,build ${babelCliPlugins}`
        },
        engines: { node: "8" },
        dependencies,
        devDependencies: {
          "@babel/cli": "^7.0.0"
        }
      }

      writeFileSync(`${this.buildDirectory}/package.json`, JSON.stringify(lines, null, 4))
    }

    copyFunctionsFiles() {
      copySync(resolve(__dirname, "files"), this.buildDirectory)
    }

    showOutput(name, runner) {
      runner.stdout.on("data", function(data) {
        consola.info(`${name} > ${data.toString().trim()}`)
      })
      runner.stderr.on("data", function(data) {
        consola.warn(`${name}: ${data.toString()}`)
      })
      runner.on("close", code => {
        consola.info(`${name} exited with code ${code}`)
      })
    }

    runtimeFile() {
      const runner = spawn("yarn", ["install", "--ignore-engines"], {
        cwd: `${process.cwd()}/${this.folderName}`
      })

      this.showOutput("Install", runner)
    }

    transpile() {
      const transpiler = spawn("yarn", ["transpile"], {
        cwd: `${process.cwd()}/${this.folderName}`
      })

      this.showOutput("Transpile", transpiler)
    }
  }()
}

const { ensureDirSync, emptyDirSync, copySync, writeFileSync } = require("fs-extra")
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
      //  this.runtimeFile()
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

    makePackageJson() {
      const dependencies = {}
      dependencies["@factor/service-firebase-functions-entry"] = "^0.0.1"
      dependencies["@factor/admin-endpoint-extend"] = "^0.0.1"

      const { pkg } = Factor.$config
      const babelCliPlugins = "--plugins=babel-plugin-dynamic-import-node"
      const lines = {
        name: "@factor/serverless-directory",
        description: "** GENERATED FILE **",
        version: pkg.version,
        scripts: {
          transpile: `npx babel src --out-dir src --ignore node_modules,dist,build ${babelCliPlugins}`,
          runtime: "npx firebase functions:config:get > .runtimeconfig.json"
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

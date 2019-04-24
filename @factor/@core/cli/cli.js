#!/usr/bin/env node

const Factor = require("vue")
const argv = require("yargs").argv
const concurrently = require("concurrently")
const execa = require("execa")
const listr = require("listr")
const program = require("commander")
const pkg = require("./package")
const argvCommands = argv._
// NODE CONFIG
process.noDeprecation = true
process.maxOldSpaceSize = 4000

program
  .version(pkg.version)
  .option("--env <env>", "Set the Node environment. Default: 'development'")
  .option("--data-export", "Export data (args needed <env> + <collection>)")
  .option("--data-import", "Import data (args needed <env> + <collection> + <data>)")
  .option("--file <file path>", "Path to a file (relative to cwd)")
  .option("--collection <collection name>", "The name of a datastore collection")
  .option("--server", "Start development server")
  .parse(process.argv)

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = program.env ? program.env : "development"
}

const cli = async () => {
  return new (class {
    constructor() {
      this.setup()
    }

    async setup() {
      require("@factor/build-extend")(Factor)

      if (program.dataExport) {
        await this.callbacks(`data-export`)
      } else if (program.dataImport) {
        await this.callbacks(`data-import`)
      } else if (program.server) {
        this.target = "build-server"
        await this.callbacks(`build-server`)
        this.devServer()
      } else {
        await this.callbacks(`build-cli`)
        await this.callbacks(`build-${process.env.NODE_ENV}`)

        this.handleCli()
      }
    }

    async callbacks(name) {
      await Factor.$filters.run(name, program)
    }

    devServer() {
      Factor.$filters.apply("create-server", { mode: process.env.NODE_ENV })
    }

    async handleCli() {
      await this.cliSpawns()

      this.runners()
    }

    async cliSpawns() {
      const spawnProcesses = Factor.$filters.apply("cli-start", [])

      const taskMap = spawnProcesses.map(({ title, command, args, options = {} }) => {
        return {
          title,
          task: () => execa(command, args, options)
        }
      })

      const tasks = new listr(taskMap)
      return tasks.run()
    }

    async runners() {
      const buildRunners = Factor.$filters.apply(`cli-runners`, [
        {
          command: `factor --server --env=${process.env.NODE_ENV}`,
          name: "Factor Server"
        }
      ])

      buildRunners.forEach(_ => {
        Factor.$log.box(`Running command: "${_.command}" @[${this.tilde(process.cwd())}]`)
      })

      try {
        await concurrently(buildRunners, {
          prefix: "name"
        })
        Factor.$log.box("Factor CLI Exited.")
      } catch (error) {
        throw new Error(error)
      }
    }

    tilde(txt) {
      const tildePath = require("expand-tilde")("~")

      return txt.replace(tildePath, "~")
    }
  })()
}

// Run class
cli()

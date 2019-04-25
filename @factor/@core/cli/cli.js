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

const cli = async () => {
  return new (class {
    constructor() {
      this.tasks = []

      this.extend()
      this.setupProgram()
      this.setNodeEnvironment()
    }

    extend() {
      require("@factor/build-extend")(Factor)
    }

    setupProgram() {
      this.program = program
      this.program
        .version(pkg.version)
        .option("--env <env>", "Set the Node environment. Default: 'development'")
        .option("--file <file path>", "Path to a file (relative to cwd)")
        .option("--collection <collection name>", "The name of a datastore collection")

      this.program
        .command("dev")
        .description("Start development server")
        .action(args => {
          process.env.NODE_ENV = "development"
          this.cli()
        })

      this.program
        .command("start")
        .description("Start production build on local server")
        .action(args => {
          process.env.NODE_ENV = "production"

          this.tasks.push({
            command: "factor",
            args: ["build"],
            title: "Generating Distribution App"
          })
          this.cli()
        })

      this.program
        .command("serve [env]")
        .description("Create local server")
        .action((env, args) => {
          this.callbacks("create-server", { env, ...args })
        })

      this.program
        .command("build [options...]")
        .option("--analyze", "Analyze package size")
        .option("--speed", "Output build speed data")
        .description("Build production app")
        .action((options, args) => {
          this.callbacks("create-distribution-app", args)
        })

      this.program
        .command("run <filter>")
        .description("Run a Factor CLI filter")
        .action((filter, args) => {
          const { parent, ...rest } = args
          this.callbacks(`cli-${filter}`, { ...parent, ...rest })
        })

      this.program.parse(process.argv)

      return this.program
    }

    setNodeEnvironment() {
      if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = this.program.env ? this.program.env : "development"
      }
    }

    async cli() {
      await this.callbacks(`build-cli`)
      await this.callbacks(`build-${process.env.NODE_ENV}`)
      await this.runTasks()
      this.runners()
    }

    async runTasks() {
      const taskProcesses = Factor.$filters.apply("cli-start", this.tasks)

      const taskMap = taskProcesses.map(({ title, command, args, options = {} }) => {
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
          command: `factor serve ${process.env.NODE_ENV}`,
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

    async callbacks(name, args) {
      try {
        await Factor.$filters.run(name, args)
      } catch (error) {
        Factor.$log.error(error)
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

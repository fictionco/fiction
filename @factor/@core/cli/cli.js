#!/usr/bin/env node

const Factor = require("vue")
//const argv = require("yargs").argv
const concurrently = require("concurrently")
const execa = require("execa")
const listr = require("listr")
const program = require("commander")
const pkg = require("./package")
//const argvCommands = argv._
// NODE CONFIG
process.noDeprecation = true
process.maxOldSpaceSize = 4000

const cli = async () => {
  return new (class {
    constructor() {
      this.tasks = []

      this.setupProgram()
    }

    extend(args = {}) {
      const { env = "development" } = args
      Factor.$headers = args
      process.env.NODE_ENV = env
      require("@factor/build-extend")(Factor)
    }

    setupProgram() {
      this.program = program
      this.program
        .version(pkg.version)
        .description("CLI for managing Factor data, builds and deployments")
        .option("-e, --env <env>", "Set the Node environment. Default: 'development'")

      this.program
        .command("dev")
        .description("Start development server")
        .action(args => {
          this.extend({ env: "development", ...args })
          this.cli()
        })

      this.program
        .command("start")
        .description("Start production build on local server")
        .action(args => {
          this.extend({ env: "production", ...args })
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
        .action((env = "development", args) => {
          this.extend({ env, ...args })
          this.callbacks("create-server", { env, ...args })
        })

      this.program
        .command("build")
        .option("--analyze", "Analyze package size")
        .option("--speed", "Output build speed data")
        .description("Build production app")
        .action(args => {
          this.createDist(args)
        })

      this.program
        .command("deploy [env]")
        .description("Build and deploy production app")
        .option("--no-build", "Prevent distribution build (for testing)")
        .action(async (env, args) => {
          await this.createDist(args)
          const t = Factor.$filters.apply("cli-tasks-deploy-app", [])
          await this.runTasks(t)
          this.callbacks("deploy-app", { env: env || "development", ...args })
        })

      this.program
        .command("run <filter>")
        .description("Run CLI utilities based on filter name (see documentation)")
        .option("-f, --file <file path>", "Path to a file (relative to cwd)")
        .option("-c, --collection <collection name>", "The name of a datastore collection")
        .option("-a, --action <action name>", "The name or ID of the action to perform.")
        .option("-i, --id <id>", "ID identifier for a post or user")
        .action(async (filter, args) => {
          const { parent, ...rest } = args
          const params = { env: "development", ...parent, ...rest }

          this.extend(params)
          try {
            await this.callbacks(`cli-${filter}`, params)
            Factor.$log.success(`Successfully ran "${filter}"`)
          } catch (error) {
            Factor.$log.error(error)
          }
        })

      this.program
        .command("help")
        .description("Show CLI commands and options")
        .action(args => {
          this.program.help()
        })

      this.program.parse(process.argv)

      const { args } = this.program
      //  console.log("----PROG", this.program.args.forEach(_ => console.log(typeof _)))
      if (!args || args.length == 0 || !args.some(_ => typeof _ == "object")) {
        this.extend(this.program)

        Factor.$log.box("No commands found. Use 'factor help' for info on using the CLI")
      }

      return this.program
    }

    async createDist(args) {
      const { build = true } = args
      this.extend({ env: "production", ...args })

      if (build) {
        await this.callbacks("create-distribution-app", args)
      }

      await this.cliTasks()
    }

    setNodeEnvironment() {
      if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = this.program.env ? this.program.env : "development"
      }
    }

    async cliTasks() {
      const t = Factor.$filters.apply("cli-tasks", this.tasks)
      await this.runTasks(t)
    }

    async cli() {
      //await this.callbacks(`build-cli`)
      // await this.callbacks(`build-${process.env.NODE_ENV}`)

      await this.cliTasks()

      const r = Factor.$filters.apply(`cli-runners`, [
        {
          command: `factor serve ${process.env.NODE_ENV}`,
          name: "Dev"
        }
      ])
      this.startRunners(r)
    }

    async runTasks(t) {
      const taskMap = t.map(({ title, command, args, options = { cwd: process.cwd(), done: false } }) => {
        return {
          title,
          task: async (ctx, task) => {
            if (typeof command == "function") {
              return await command(ctx, task)
            } else {
              return execa(command, args, options).then(() => {
                task.title = options.done ? options.done : task.title
              })
            }
          }
        }
      })

      const tasks = new listr(taskMap) //, { concurrent: true }

      try {
        await tasks.run()
      } catch (error) {
        Factor.$log.error(error)
      }
      return
    }

    async startRunners(r) {
      const chalk = require("chalk")

      r.forEach(_ => {
        Factor.$log.success(`Starting: "${_.command}"`)
      })

      r = r.map(_ => {
        return { ..._, prefixColor: "white" }
      })

      try {
        await concurrently(r, {
          prefix: chalk.bold(`{name} -`),
          prefixLength: 8
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

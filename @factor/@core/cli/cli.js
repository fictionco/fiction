#!/usr/bin/env node

const Factor = require("vue")
const concurrently = require("concurrently")
const execa = require("execa")
const listr = require("listr")
const program = require("commander")
const pkg = require("./package")
const consola = require("consola")

process.noDeprecation = true
process.maxOldSpaceSize = 8000

const cli = async () => {
  return new (class {
    constructor() {
      this.installationTasks = [
        { command: "yarn", args: ["install"], title: "Installing Dependencies" },
        { command: "factor", args: ["run", "create-loaders"], title: "Creating Extension Loaders" }
      ]
      this.tasks = []

      this.setupProgram()
    }

    async extend(args = {}) {
      const { env = "development", install = false, serve = false } = args

      if (install) {
        await this.runTasks(this.installationTasks, { exitOnError: false })
      }

      Factor.$headers = args
      process.env.NODE_ENV = env
      require("@factor/build-extend")(Factor)

      Factor.$stack.register({
        id: "deploy-app",
        description: "Deploys app to hosting and cloud environments.",
        args: "{env, args [from cli]}"
      })

      Factor.$stack.register({
        id: "endpoint-emulator",
        description: "Emulates serverless endpoints locally"
      })

      if (install) {
        await this.callbacks("verify-app", { env, ...args })
      }

      return
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
        .action(async args => {
          await this.extend({ env: "development", ...args, install: true })
          await this.cliTasks()

          this.cliRunners()
        })

      this.program
        .command("start")
        .description("Start production build on local server")
        .action(async args => {
          await this.extend({ env: "production", ...args, install: true })
          this.tasks.push({
            command: "factor",
            args: ["build", env],
            title: "Generating Distribution App"
          })
          await this.cliTasks()

          this.cliRunners()
        })

      this.program
        .command("serve [env]")
        .description("Create local server")
        .action(async (env = "development", args) => {
          await this.extend({ env, ...args, serve: true })
          this.callbacks("create-server", { env, ...args })
        })

      this.program
        .command("build [env]")
        .option("--analyze", "Analyze package size")
        .option("--speed", "Output build speed data")
        .description("Build production app")
        .action(async (env = "development", args) => {
          await this.createDist({ env, ...args })
        })

      this.program
        .command("deploy [env]")
        .description("Build and deploy production app")
        .option("--no-build", "Prevent distribution build (for testing)")
        .action(async (env, args) => {
          await this.createDist({ env, ...args })

          await this.callbacks("deploy-app", { env: env || "development", ...args })
          const t = Factor.$filters.apply("cli-tasks-deploy-app", [])
          await this.runTasks(t)
        })

      this.program
        .command("setup [filter]")
        .description("Setup and verify your Factor app")
        .action(async (filter, args) => {
          const { parent, ...rest } = args
          const params = { env: "development", ...parent, ...rest, install: true }

          filter = filter || "setup"

          await this.extend(params)
          await this.callbacks(`cli-${filter}`, params)
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

          await this.extend(params)
          try {
            await this.callbacks(`cli-${filter}`, params)
            Factor.$log.success(`Successfully ran "${filter}"\n\n`)
          } catch (error) {
            Factor.$log.error(error)
            throw new Error(error)
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
        console.log("No commands found. Use 'factor help' for info on using the CLI")
      }

      return this.program
    }

    async createDist(args) {
      const { build = true } = args
      await this.extend({ ...args, install: true })

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

    async cliRunners() {
      const r = Factor.$filters.apply(`cli-runners`, [
        {
          command: `factor serve ${process.env.NODE_ENV}`,
          name: "Build"
        }
      ])

      this.startRunners(r)
    }

    async runTasks(t, opts = {}) {
      const taskMap = t.map(
        ({ title, command, args, options = { cwd: process.cwd(), done: false, output: false } }) => {
          return {
            title,
            task: async (ctx, task) => {
              if (typeof command == "function") {
                return await command(ctx, task)
              } else {
                const proc = execa(command, args, options)

                proc.stdout.on("data", data => {
                  task.output = data.toString()
                })

                proc.stderr.on("data", data => {
                  task.output = data.toString()
                })

                return proc.then(() => {
                  task.title = options.done ? options.done : task.title
                })
              }
            }
          }
        }
      )

      const tasks = new listr(taskMap, opts) //, { concurrent: true }

      try {
        await tasks.run()
      } catch (error) {
        console.error(error)
        // process.exit(1)
      }
      return
    }

    async startRunners(r) {
      const chalk = require("chalk")
      const figures = require("figures")

      const lines = []
      r.forEach(_ => {
        lines.push({ title: "Command", value: `"${_.command}"`, indent: true })
      })

      Factor.$log.formatted({
        title: "Starting Engines...",
        lines
      })

      r = r.map(_ => {
        return { ..._, prefixColor: "white" }
      })

      try {
        await concurrently(r, {
          prefix: chalk.bold(`{name}`) + " " + figures.arrowRight
        })
      } catch (error) {
        consola.error(error)
      }
    }

    async callbacks(id, args) {
      try {
        await Factor.$filters.run(id, args)
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

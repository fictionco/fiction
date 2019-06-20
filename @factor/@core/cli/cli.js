#!/usr/bin/env node

const Factor = require("vue")
const concurrently = require("concurrently")
const execa = require("execa")
const listr = require("listr")
const program = require("commander")
const inquirer = require("inquirer")
const pkg = require("./package")
const consola = require("consola")

process.noDeprecation = true
process.maxOldSpaceSize = 8000

const cli = async () => {
  return new (class {
    constructor() {
      this.passedArguments = process.argv.filter(_ => _.includes("--"))

      this.setupProgram()
    }

    async extend(args = {}) {
      const { parent, ...rest } = args
      const program = { ...parent, ...rest }
      const { NODE_ENV = "development", install = false } = program

      if (install) {
        await this.runTasks(
          [
            { command: "yarn", args: ["install"], title: "Installing Dependencies" },
            {
              command: "factor",
              args: ["run", "create-loaders", "--no-load-plugins"],
              title: "Creating Extension Loaders"
            }
          ],
          { exitOnError: true }
        )
      }

      process.env.NODE_ENV = NODE_ENV
      process.env.FACTOR_ENV = program.ENV || NODE_ENV

      require("@factor/build-extend")
        .default(Factor)
        .run()

      return program
    }

    setupProgram() {
      this.program = program
      this.program.allowUnknownOption(true) // options added by filters
      this.program
        .version(pkg.version)
        .description("CLI for managing Factor data, builds and deployments")
        .option("--PORT <PORT>", "set server port. default: 3000")
        .option("--ENV <ENV>", "set FACTOR_ENV. default: NODE_ENV")
        .option("--no-load-plugins", "Do not extend build for this command.")

      this.program
        .command("dev")
        .description("Start development server")
        .action(async args => {
          await this.extend({ NODE_ENV: "development", install: true, ...args })
          await this.cliTasks()
          this.cliRunners()
        })

      this.program
        .command("start")
        .description("Start production build on local server")
        .action(async args => {
          await this.extend({ NODE_ENV: "production", install: false, ...args })

          await this.cliTasks([
            {
              command: "factor",
              args: ["build"],
              title: "Generating Distribution App"
            }
          ])

          this.cliRunners()
        })

      this.program
        .command("serve [NODE_ENV]")
        .description("Create local server")
        .action(async (NODE_ENV, args) => {
          NODE_ENV = NODE_ENV || "production"

          await this.extend({ NODE_ENV, ...args })

          this.run("create-server", { NODE_ENV, ...args })
        })

      this.program
        .command("build")
        .option("--analyze", "Analyze package size")
        .option("--speed", "Output build speed data")
        .description("Build production app")
        .action(async args => {
          await this.createDist(args)
        })

      this.program
        .command("setup [filter]")
        .description("Setup and verify your Factor app")
        .action(async (filter, args) => {
          const program = await this.extend({ NODE_ENV: "development", filter, install: true, ...args })
          await this.extend(program)
          await this.run(`cli-setup`, { inquirer, program })
        })

      this.program
        .command("run <filter>")
        .description("Run CLI utilities based on filter name (see documentation)")
        .action(async (filter, args) => {
          const program = await this.extend({ NODE_ENV: "development", ...args })

          try {
            await this.run(`cli-run-${filter}`, { inquirer, program })
            Factor.$log.success(`Successfully ran "${filter}"\n\n`)
            process.exit(0)
          } catch (error) {
            Factor.$log.error(error)
            throw new Error(error)
          }
        })

      this.program
        .command("help")
        .description("Show CLI commands and options")
        .action(args => {
          this.program.outputHelp(_ => {
            return _
          })
          // console.log()
          // console.log("Examples:")
          // console.log("  $ custom-help --help")
          // console.log("  $ custom-help -h")
        })
      try {
        this.program.parse(process.argv)
      } catch (error) {
        console.log("works")
      }
      const { args } = this.program

      if (!args || args.length == 0 || !args.some(_ => typeof _ == "object")) {
        console.log("No commands found. Use 'factor help' for info on using the CLI")
      }

      return this.program
    }

    async createDist(args) {
      const program = await this.extend({ NODE_ENV: "production", install: true, ...args })
      await this.run("create-distribution-app", program)
      await this.cliTasks()
    }

    async cliRunners() {
      const commandArgs = [process.env.NODE_ENV, ...this.passedArguments]

      const r = Factor.$filters.apply(
        `cli-concurrent`,
        [
          {
            command: `factor serve ${commandArgs.join(" ")}`,
            name: "Server"
          }
        ],
        commandArgs
      )

      this.startRunners(r)
    }

    async cliTasks(t = []) {
      await this.runTasks(Factor.$filters.apply("cli-tasks", t))
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
                  const taskError = data.toString()
                  throw new Error(taskError)
                })

                try {
                  await proc

                  task.title = options.done ? options.done : `${task.title} [Done!]`

                  return
                } catch (error) {}
              }
            }
          }
        }
      )

      const tasks = new listr(taskMap, opts) //, { concurrent: true }

      await tasks.run()
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
          prefix: chalk.dim(`{name} ${figures.arrowRight}`),
          raw: true
        })
      } catch (error) {
        consola.error(error)
      }
    }

    async run(id, args) {
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

    async exitHandler() {
      await Factor.$filters.run("exit")

      process.exit(0)
    }

    handleProcessExit() {
      process.stdin.resume()
      //do something when app is closing
      process.on("exit", this.exitHandler())

      //catches ctrl+c event
      process.on("SIGINT", this.exitHandler())

      // catches "kill pid" (for example: nodemon restart)
      process.on("SIGUSR1", this.exitHandler())
      process.on("SIGUSR2", this.exitHandler())

      //catches uncaught exceptions
      process.on("uncaughtException", this.exitHandler({ code: 1 }))
    }
  })()
}

// Run class
cli()

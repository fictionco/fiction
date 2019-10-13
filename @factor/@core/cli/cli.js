#!/usr/bin/env node

const Factor = require("vue")
const execa = require("execa")
const listr = require("listr")
const program = require("commander")
const inquirer = require("inquirer")
const pkg = require("./package")

process.noDeprecation = true
process.maxOldSpaceSize = 8192

const cli = () => {
  return new (class {
    constructor() {
      this.passedArguments = process.argv.filter(_ => _.includes("--"))

      this.setupProgram()
    }

    setupProgram() {
      this.program = program

      // options added by filters, plugins or if not wanted in '--help'
      this.program.allowUnknownOption(true)

      this.program
        .version(pkg.version)
        .description("CLI for managing Factor data, builds and deployments")
        .option("--PORT <PORT>", "set server port. default: 3000")
        .option("--ENV <ENV>", "set FACTOR_ENV. default: NODE_ENV")
        .option("--no-load-plugins", "Do not extend build for this command.")
        .option("--restart", "Restart server process flag.")

      this.program
        .command("dev")
        .description("Start development server")
        .action(_arguments =>
          this.runCommand({ command: "dev", _arguments, NODE_ENV: "development" })
        )

      this.program
        .command("start")
        .description("Build and then serve production app.")
        .action(_arguments => this.runCommand({ command: "start", _arguments }))

      this.program
        .command("serve [NODE_ENV]")
        .description("Serve app in selected environment.")
        .action((NODE_ENV, _arguments) =>
          this.runCommand({ command: "serve", _arguments, install: false, NODE_ENV })
        )

      this.program
        .command("build")
        .option("--analyze", "Analyze package size")
        .option("--speed", "Output build speed data")
        .description("Build production app")
        .action(_arguments => this.runCommand({ command: "build", _arguments }))

      this.program
        .command("setup [filter]")
        .description("Setup and verify your Factor app")
        .action((filter, _arguments) =>
          this.runCommand({ command: "setup", filter, _arguments })
        )

      this.program
        .command("run <filter>")
        .description("Run CLI utilities based on filter name (see documentation)")
        .action((filter, _arguments) =>
          this.runCommand({ command: "run", filter, install: false, _arguments })
        )

      // Default to 'dev' command
      if (process.argv.length === 2) {
        process.argv.push("dev")
      }

      this.program.parse(process.argv)

      return this.program
    }

    async runCommand(options) {
      const {
        command,
        _arguments = {},
        filter,
        install,
        NODE_ENV = command == "dev" ? "development" : "production",
        extend = true
      } = options

      await this.factorize({ NODE_ENV, command, filter, install, ..._arguments, extend })

      try {
        if (["build", "start"].includes(command)) {
          await Factor.$filters.run("create-distribution-app", _arguments)
        } else if (command == "setup") {
          await Factor.$filters.run(`cli-setup`, { inquirer, ..._arguments })
        } else if (command == "run") {
          await Factor.$filters.run(`cli-run-${filter}`, { inquirer, ..._arguments })

          Factor.$log.success(`Successfully ran "${filter}"\n\n`)
        }

        if (["start", "dev", "serve"].includes(command)) {
          await this.runServer({ NODE_ENV, ..._arguments }) // Long running process
        } else {
          Factor.$log.success(`Successfully ran [${command}]`)
          process.exit(0)
        }
      } catch (error) {
        Factor.$log.error(error)
      }

      return
    }

    async factorize(_arguments = {}) {
      const { parent = {}, ...rest } = _arguments
      const program = { ...parent, ...rest }

      const { NODE_ENV = "production", install = true, extend = true, command } = program

      if (install) {
        await this.runTasks(
          [
            { command: "yarn", args: ["install"], title: "Verify Dependencies" },
            {
              command: "factor",
              args: ["run", "create-loaders", "--no-load-plugins"],
              title: "Verify Extensions"
            }
          ],
          { exitOnError: true }
        )
      }

      process.env.FACTOR_CWD = process.env.FACTOR_CWD || process.cwd()
      process.env.NODE_ENV = NODE_ENV
      process.env.FACTOR_ENV = program.ENV || process.env.FACTOR_ENV || NODE_ENV
      process.env.FACTOR_COMMAND = command || program._name || "none"

      this.refineNodeRequire()

      require("@factor/build/transpiler").default(Factor)

      if (extend) {
        const extender = require("@factor/extend/server").default(Factor)
        await extender.extend(_arguments)
      }

      // Filters must be reloaded with every new extension.
      // server resets "re-extend" the process
      Factor.$filters.callback("rebuild-server-app", () =>
        this.reloadNodeProcess(_arguments)
      )

      // When an extended Factor object is needed outside of this CLI (tests)
      return Factor
    }

    async runServer(_arguments) {
      const { NODE_ENV = process.env.NODE_ENV, FACTOR_ENV, FACTOR_COMMAND } = process.env

      const message = {
        title: "Starting Server...",
        lines: [
          { title: "NODE_ENV", value: NODE_ENV, indent: true },
          { title: "FACTOR_ENV", value: FACTOR_ENV, indent: true },
          { title: "FACTOR_COMMAND", value: FACTOR_COMMAND, indent: true },
          { title: "CWD", value: Factor.$paths.get("app"), indent: true }
        ]
      }

      if (NODE_ENV == "development") {
        message.lines.unshift({
          title: "URL",
          value: Factor.$paths.localhostUrl(),
          indent: true
        })
      }

      Factor.$log.formatted(message)

      await Factor.$filters.run("create-server", _arguments)
    }

    refineNodeRequire() {
      require.extensions[".md"] = () => {}
      require.extensions[".svg"] = () => {}
      require.extensions[".jpg"] = () => {}
      require.extensions[".png"] = () => {}
      require.extensions[".vue"] = () => {}
    }

    // Reloads all cached node files
    // Needed for server reloading
    async reloadNodeProcess(args) {
      Object.keys(require.cache).forEach(function(id) {
        if (/(@|\.)factor/.test(id)) {
          delete require.cache[id]
        }
      })

      await this.factorize({
        ...args,
        install: false,
        restart: true,
        NODE_ENV: "development"
      })
    }

    async runTasks(t, opts = {}) {
      if (t.length == 0) return

      // Don't log during tests
      if (process.env.FACTOR_ENV == "test") opts.renderer = "silent"

      // Allow dynamically set CWD
      const cwd = process.env.FACTOR_CWD || process.cwd()

      const taskMap = t.map(
        ({ title, command, args, options = { cwd, done: false, output: false } }) => {
          return {
            title,
            task: async (ctx, task) => {
              if (typeof command == "function") {
                return await command(ctx, task)
              } else {
                const proc = execa(command, args, options)

                if (proc) {
                  proc.stdout.on("data", data => {
                    task.output = data.toString()
                  })

                  proc.stderr.on("data", data => {
                    task.output = data.toString()
                  })

                  await proc

                  task.title = options.done ? options.done : `${task.title} [Done!]`

                  return
                }
              }
            }
          }
        }
      )

      const tasks = new listr(taskMap, opts) //, { concurrent: true }

      await tasks.run()

      return
    }
  })()
}

// Run class

module.exports.default = cli()

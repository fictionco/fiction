import { CliOptions } from "./types"

export class CliCommand<T extends string = string> {
  public command: T
  public description: string
  public options: CliOptions

  constructor(settings: {
    command: T
    description: string
    options: CliOptions
  }) {
    this.command = settings.command
    this.description = settings.description
    this.options = settings.options
  }

  setOptions(options: CliOptions): this {
    if (options.serve) options.exit = false

    this.options = { ...this.options, ...options }
    return this
  }
}

export const standardAppCommands = [
  new CliCommand({
    command: "build",
    description: "builds the app",
    options: { mode: "production", exit: true },
  }),
  new CliCommand({
    command: "bundle",
    description: "bundles JS packages",
    options: { mode: "production", exit: true },
  }),
  new CliCommand({
    command: "start",
    description: "serves a built app",
    options: { mode: "production", exit: false },
  }),
  new CliCommand({
    command: "prerender",
    description: "prerenders app",
    options: { mode: "production", exit: true },
  }),
  new CliCommand({
    command: "server",
    description: "runs endpoint server",
    options: { mode: "production", exit: false },
  }),
  new CliCommand({
    command: "dev",
    description: "runs services in dev mode",
    options: { mode: "development", exit: false },
  }),
  new CliCommand({
    command: "rdev",
    description: "runs dev with nodemon",
    options: { mode: "development", exit: false },
  }),
  new CliCommand({
    command: "release",
    description: "builds and releases packages on NPM",
    options: { mode: "production", exit: true },
  }),
  new CliCommand({
    command: "deploy",
    description: "deploys changes to 'deploy' branch",
    options: { mode: "production", exit: true },
  }),
  new CliCommand({
    command: "generate",
    description: "builds static schemas and config",
    options: { mode: "production", exit: true },
  }),
]

import { CliOptions } from "./types"

export class CliCommand<T extends string = string> {
  public command: T
  public description?: string
  public options: CliOptions
  type: "service" | "build" | "dev" | "util"
  port?: number
  constructor(settings: {
    command: T
    description?: string
    options: CliOptions
    type: "service" | "build" | "dev" | "util"
    port?: number
  }) {
    this.command = settings.command
    this.description = settings.description
    this.options = settings.options
    this.type = settings.type
    this.port = settings.port
  }

  setOptions(options: CliOptions): this {
    if (options.serve) options.exit = false

    this.options = { ...this.options, ...options }
    return this
  }
}

export const standardAppCommands = [
  new CliCommand({
    command: "render",
    description: "renders app",
    options: { mode: "production", exit: true },
    type: "build",
  }),
  new CliCommand({
    command: "server",
    description: "runs endpoint server",
    options: { mode: "production", exit: false },
    type: "service",
    port: 3333,
  }),
  new CliCommand({
    command: "app",
    description: "serves static app",
    options: { mode: "production", exit: false },
    type: "service",
    port: 3000,
  }),
  new CliCommand({
    command: "dev",
    description: "runs services in dev mode",
    options: { mode: "development", exit: false },
    type: "dev",
  }),
  new CliCommand({
    command: "r-dev",
    description: "runs dev with nodemon",
    options: { mode: "development", exit: false },
    type: "dev",
  }),
]

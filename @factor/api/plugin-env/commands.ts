import { CliOptions } from "./types"

export class CliCommand<T extends string = string> {
  public command: T
  public description?: string
  public options: CliOptions
  type: "service" | "build" | "dev" | "util"
  port?: number
  devOnly: boolean
  constructor(settings: {
    command: T
    description?: string
    options?: CliOptions
    type: "service" | "build" | "dev" | "util"
    port?: number
    devOnly?: boolean
  }) {
    this.command = settings.command
    this.description = settings.description
    this.type = settings.type
    this.port = settings.port
    this.devOnly = settings.devOnly || false

    const defaultOptions: CliOptions =
      this.type == "service"
        ? { mode: "production", exit: false }
        : { mode: "development", exit: true }

    this.options = { ...defaultOptions, ...settings.options }
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
    command: "build",
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

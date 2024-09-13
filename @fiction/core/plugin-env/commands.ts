import type { Ref } from 'vue'
import type { CliOptions } from './types.js'
import { computed, ref } from 'vue'

export class CliCommand<T extends string = string> {
  public command: T
  public description?: string
  public options: CliOptions
  type: 'service' | 'build' | 'dev' | 'util'
  port: Ref<number | undefined>
  url = computed(() => this.port.value ? `http://localhost:${this.port.value}` : '')
  devOnly: boolean
  clientCommand?: string
  constructor(settings: {
    command: T
    description?: string
    options?: CliOptions
    type: 'service' | 'build' | 'dev' | 'util'
    port?: number
    devOnly?: boolean
    clientCommand?: string
  }) {
    this.command = settings.command
    this.description = settings.description
    this.type = settings.type
    this.port = ref(settings.port)
    this.devOnly = settings.devOnly || false
    this.clientCommand = settings.clientCommand || this.command

    const defaultOptions: CliOptions
      = this.type === 'service'
        ? { mode: 'production', exit: false }
        : this.type === 'build'
          ? { mode: 'production', exit: true }
          : { mode: 'development', exit: true }

    this.options = { ...defaultOptions, ...settings.options }
  }

  setOptions(options: CliOptions): this {
    if (options.serve)
      options.exit = false

    this.options = { ...this.options, ...options }
    return this
  }

  toConfig() {
    return {
      command: this.command,
      description: this.description,
      options: this.options,
      type: this.type,
      port: this.port.value,
      url: this.url.value,
      devOnly: this.devOnly,
      clientCommand: this.clientCommand,
    }
  }
}

export const standardAppCommands = [
  new CliCommand({
    command: 'render',
    description: 'renders app',
    options: { mode: 'production', exit: true },
    type: 'build',
  }),
  new CliCommand({
    command: 'build',
    description: 'renders app',
    options: { mode: 'production', exit: true },
    type: 'build',
  }),
  new CliCommand({
    command: 'server',
    description: 'runs endpoint server',
    options: { mode: 'production', exit: false },
    type: 'service',
    port: 3333,
  }),
  new CliCommand({
    command: 'app',
    description: 'serves static app',
    options: { mode: 'production', exit: false },
    type: 'service',
    port: 3000,
  }),
  new CliCommand({
    command: 'dev',
    description: 'runs services in dev mode',
    options: { mode: 'development', exit: false },
    type: 'dev',
  }),
  new CliCommand({
    command: 'r-dev',
    description: 'runs dev with nodemon',
    options: { mode: 'development', exit: false },
    type: 'dev',
  }),
]

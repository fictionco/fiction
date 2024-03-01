/* eslint-disable no-console */
/**
 * notes
 * - Since many files use this logger, be careful for
 * circular dependencies
 * - Dependencies should be lean as this gets included in slim builds
 */
import prettyoutput from 'prettyoutput'
import dayjs from 'dayjs'
import chalk from 'chalk'
import type { Omit, Record } from '@sinclair/typebox'
import { isDebug, isNode, isProd, isRestart } from '../utils/vars'
import { runHooks } from '../utils/hook'
import type { HookType } from '../utils/hook'

type Levels = 'error' | 'warn' | 'info' | 'debug' | 'trace'

declare global {
  interface Window {
    factorLogKey?: string
  }
}

export type LogHelper = Record<
  Levels,
  (description: string, data?: unknown) => void
>

interface LoggerArgs {
  level: Levels
  context?: string
  description?: string
  data?: Record<string, any> | unknown
  error?: Error | unknown
  disableOnRestart?: boolean
  priority?: number
  color?: string
}

export type FactorLogHookDictionary = {
  logServer: { args: [LoggerArgs] }
}
interface FactorLogSettings {
  hooks?: HookType<FactorLogHookDictionary>[]
  isProd?: boolean
  isRestart?: boolean
  isDebug?: boolean
}
export class FactorLog {
  hooks: HookType<FactorLogHookDictionary>[]
  isProd: boolean
  isRestart: boolean
  isDebug: boolean
  constructor(settings: FactorLogSettings = {}) {
    this.hooks = settings.hooks ?? []
    this.isProd = settings.isProd ?? isProd()
    this.isRestart = settings.isRestart ?? isRestart()
    this.isDebug = settings.isDebug ?? isDebug()

    this.browserShouldLog({ notify: true })
  }

  logLevel = {
    trace: { color: '#5233ff', priority: 5 },
    debug: { color: '#00BD0C', priority: 5 },
    info: { color: '#00ABFF', priority: 10 },
    warn: { color: '#ffa500', priority: 30 },
    error: { color: '#FF0000', priority: 40 },
  }

  addHook(hook: HookType<FactorLogHookDictionary>): void {
    this.hooks.unshift(hook)
  }

  private formatTimestamp(): string {
    return new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  private browserShouldLog(args: { notify: boolean }): boolean {
    let shouldLog: boolean
    if (isNode() || typeof window === 'undefined') {
      shouldLog = false
    }
    else {
      const logKey = 'factorLog'
      const hostname = window.location.hostname

      shouldLog = !this.isProd || (hostname === 'localhost' || hostname === 'lan.com') || !!localStorage.getItem(logKey)

      if (args.notify && !shouldLog) {
        console.log(`Log disabled`, hostname, this.isProd)
        console.log('To enable, run: ')
        console.log('localStorage.setItem("factorLog", "true")')
      }
    }

    return shouldLog
  }

  private logBrowser(config: LoggerArgs): void {
    const { level, description, context, color, data, error } = config

    if (this.browserShouldLog({ notify: false }) && console[level]) {
      const contextInfo = context ? `(${context})` : '(???)'
      const styleHeader = `color: ${color}; font-weight: bold;`
      const styleContext = `color: ${color}99;`

      console[level](
        `%c${level.toUpperCase()} %c${contextInfo}: %c${description}`,
        styleContext,
        styleHeader,
        'color: initial;',
        data ? `\nData:` : '',
        data || '',
      )

      if (error) {
        console.error('Error Details:', error)
        const e = error as Error
        if (e.stack)
          console.error('Error Stack:', e.stack)
      }
    }
  }

  private refineDataRecursive(args: {
    obj: Record<string, any>
    depth?: number
    maxDepth?: number
    maxSize?: number
    maxProperties?: number
  }): Record<string, any> | string {
    const { obj, depth = 0, maxDepth = 4, maxSize = 12000, maxProperties = 100 } = args

    if (typeof obj !== 'object' || !obj)
      return obj

    const newDepth = depth + 1
    if (newDepth > maxDepth)
      return `Summary: Depth Limit Exceeded (Max Depth: ${maxDepth})`

    const getType = (obj: any) => {
      if (Array.isArray(obj))
        return 'Array'
      if (obj instanceof Map)
        return 'Map'
      if (obj instanceof Set)
        return 'Set'
      if (obj instanceof Date)
        return 'Date'
      return obj.constructor?.name ?? 'Object'
    }

    const summarizeObject = (obj: Record<string, any>, reason: string) => {
      const objType = getType(obj)
      const propCount = Object.keys(obj).length
      return `Summary (${objType}): ${propCount} properties | Reason: ${reason}`
    }

    try {
      return Object.fromEntries(
        Object.entries(obj).slice(0, maxProperties).map(([key, value]) => {
          if (dayjs.isDayjs(value)) {
            return [key, `DAYJS: ${value.toISOString()}`]
          }
          else if (Array.isArray(value)) {
            return [key, value] // Handle arrays as-is
          }
          else if (typeof value === 'object' && value) {
            try {
              const stringified = JSON.stringify(value)
              if (stringified.length > maxSize)
                return [key, summarizeObject(value, `Size Limit Exceeded (Size: ${stringified.length}, Max: ${maxSize})`)]

              else if (newDepth >= maxDepth)
                return [key, summarizeObject(value, `Depth Limit Reached (Depth: ${newDepth}, Max: ${maxDepth})`)]

              else if (value.constructor && value.constructor.name !== 'Object')
                return [key, `Instance of ${value.constructor.name}`]

              else
                return [key, this.refineDataRecursive({ ...args, obj: value, depth: newDepth })]
            }
            catch {
              return [key, summarizeObject(value, `Unable to Serialize`)]
            }
          }
          return [key, value]
        }),
      )
    }
    catch (error) {
      const e = error as Error
      console.error('Error processing object:', e)
      return `Error: ${e.message}`
    }
  }

  logError(config: {
    error: Error | unknown
    context?: string
    description?: string
    color?: string
  },
  ): void {
    const { error, context = 'Unknown Context', color = '#ff4757', description } = config

    const e = error as Error

    // Create a minimalistic timestamp
    const timestamp = this.formatTimestamp()

    // Prepare the main log message
    const logContext = chalk.hex(color)(`(${context}): `.padEnd(6))
    const logTimestamp = chalk.hex(color).dim(`${timestamp} ERROR `)
    const logDescription = description ? `${chalk.red(description)} ` : ''

    const errorMessage = chalk.bold(`${e.message ?? 'Unknown Error'}`)
    const errorDescription = e.message ? `${chalk.dim('MESSAGE >')} ${errorMessage}` : ''
    const logMessage = `${logTimestamp}${logContext}${logDescription}`

    console.log(logMessage)
    console.log(errorDescription)

    // Format and log the stack trace, if available
    if (e.stack) {
      const formattedStackTrace = e.stack
        .split('\n')
        .slice(1)
        .map(line => chalk.gray(line.trim()))
        .join('\n')

      console.log(formattedStackTrace)
    }
  }

  private logServer(config: LoggerArgs): void {
    const {
      level,
      disableOnRestart,
      context,
      color = '#dddddd',
      data,
      description,
      error,
    } = config

    if (disableOnRestart && this.isRestart)
      return

    // Create a minimalistic timestamp
    const timestamp = this.formatTimestamp()

    if (error) {
      this.logError({ error, context, description, color })
    }
    else {
      // Prepare the main log message
      const logMessage = `${chalk.hex(color).dim(`${timestamp} ${level.toUpperCase()} `)}${chalk.hex(color)(`(${context ?? '???'}): `.padEnd(10))}${description || ''}`

      console.log(logMessage)
    }

    // Handle Error instance data
    if (data instanceof Error)
      this.logError({ error: data, context, color })

    else if (typeof data === 'object' && data && Object.keys(data).length > 0)
      console.log(prettyoutput(this.refineDataRecursive({ obj: data }), { colors: { number: 'yellow' }, maxDepth: 5 }, 2))

    runHooks<FactorLogHookDictionary, 'logServer'>({
      list: this.hooks,
      hook: 'logServer',
      args: [config],
    }).catch(console.error)
  }

  l(config: LoggerArgs): void {
    const { level } = config

    config.priority = this.logLevel[level].priority
    config.color = this.logLevel[level].color

    if (isNode()) {
      if (config.priority < 10 && !this.isProd && !this.isDebug)
        config.data = undefined

      this.logServer(config)
    }
    else {
      this.logBrowser(config)
    }
  }

  warn(
    context: string,
    description: string,
    config?: Omit<LoggerArgs, 'level' | 'context' | 'description'>,
  ): void {
    this.l({ level: 'warn', context, description, ...config })
  }

  error(
    context: string,
    description: string,
    config?: Omit<LoggerArgs, 'level' | 'context' | 'description'>,
  ): void {
    this.l({ level: 'error', context, description, ...config })
  }

  info(
    context: string,
    description: string,
    config?: Omit<LoggerArgs, 'level' | 'context' | 'description'>,
  ): void {
    this.l({ level: 'info', context, description, ...config })
  }

  debug(
    context: string,
    description: string,
    config?: Omit<LoggerArgs, 'level' | 'context' | 'description'>,
  ): void {
    this.l({ level: 'debug', context, description, ...config })
  }

  contextLogger = (context: string): LogHelper => {
    const out: Record<string, any> = {}

    const levels = Object.keys(this.logLevel) as Levels[]

    levels.forEach((level) => {
      out[level] = (
        description: string,
        config?: Omit<LoggerArgs, 'level' | 'context' | 'description'>,
      ): void => this.l({ level, description, context, ...config })
    })

    return out as LogHelper
  }
}

export const log = new FactorLog()

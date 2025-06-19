import type { FictionEnv } from '../plugin-env/index.js'
import { log } from '../plugin-log/index.js'
import { FictionObject } from '../plugin.js'
import { isPlainObject } from './obj.js'

const logger = log.contextLogger('processors')

// Define the types for processors and arguments
type ProcessorArgs = {
  key: string
  value: any
}

export type Processor<T = unknown> = {
  condition: (args: ProcessorArgs) => Promise<boolean> | boolean
  action: (value: T) => Promise<T> | T
}

// The main class for object processing
export class ObjectProcessor {
  private processors: Processor<any>[] = []

  constructor(processors?: Processor<any>[]) {
    if (processors)
      this.processors = processors
  }

  // Method to add a processor
  public addProcessor(processor: Processor<any>): void {
    this.processors.push(processor)
  }

  public async parseObject(obj: any, parentKey: string = ''): Promise<any> {
    if (Array.isArray(obj)) {
      return Promise.all(obj.map(async item => this.parseValue(item, parentKey)))
    }
    else if (isPlainObject(obj)) {
      const processedEntries = await Promise.all(
        Object.entries(obj).map(async ([key, value]) => {
          try {
            const processedValue = await this.parseValue(value, key)
            return [key, processedValue] // Always return key-value pair
          }
          catch (error) {
            logger.error(`Error processing ${key}`, { error })
            return null // Return null if an error occurs
          }
        }),
      )
      // Filter out null entries and convert back to object
      return Object.fromEntries(processedEntries.filter(entry => entry !== null) as [string, any][])
    }
    else {
      return this.runProcessors({ key: parentKey, value: obj })
    }
  }

  private async parseValue(value: any, key: string): Promise<any> {
    const processedValue = await this.runProcessors({ key, value })
    if (processedValue !== value)
      return processedValue

    if (isPlainObject(value) || Array.isArray(value))
      return this.parseObject(value, key)

    return value
  }

  private async runProcessors({ key, value }: ProcessorArgs): Promise<any> {
    for (const processor of this.processors) {
      if (await processor.condition({ key, value })) {
        try {
          const r = await processor.action(value)
          return r
        }
        catch (error) {
          logger.error(`Error in processor for key: ${key}`, { error })
          throw error // Re-throw the error to be caught by parseValue
        }
      }
    }
    return value
  }
}

// Base attribute type
type BaseShortcodeAttributes = Record<string, string | number>

// Define a mapped type for shortcode configurations
export type ShortcodeConfig = Record<string, BaseShortcodeAttributes>

// ShortcodeMatch now accepts a generic that extends BaseShortcodeAttributes
export type ShortcodeMatch<T extends BaseShortcodeAttributes = BaseShortcodeAttributes> = {
  shortcode: string
  content: string
  attributes: T
  fullMatch: string
}

// Handler accepts a generic type for attributes
export type ShortcodeHandler<T extends BaseShortcodeAttributes = BaseShortcodeAttributes>
  = (args: { content?: string, attributes?: T, fullMatch: string }) => string | Promise<string>

// Loader accepts a generic for the shortcode name and its attributes
export type ShortcodeLoader<
  TConfig extends ShortcodeConfig = ShortcodeConfig,
  TName extends keyof TConfig = keyof TConfig,
> = {
  shortcode: string & TName
  handler: ShortcodeHandler<TConfig[TName]>
}

type ShortcodeSettings<TConfig extends ShortcodeConfig = ShortcodeConfig> = {
  fictionEnv?: FictionEnv
  shortcodes?: ShortcodeLoader<TConfig>[]
}

export class Shortcodes<TConfig extends ShortcodeConfig = ShortcodeConfig> extends FictionObject<ShortcodeSettings<TConfig>> {
  private shortcodes: Record<string, ShortcodeHandler> = {}
  private hasAsyncShortcodes = false

  constructor(settings: ShortcodeSettings<TConfig> = {}) {
    super('Shortcodes', settings)
    this.initializeDefaultShortcodes()
  }

  clear() {
    this.shortcodes = {}
    this.hasAsyncShortcodes = false
    this.initializeDefaultShortcodes()
  }

  private initializeDefaultShortcodes(): void {
    this.addShortcode<BaseShortcodeAttributes>({
      shortcode: 'cwd',
      handler: () => this.settings.fictionEnv?.cwd || '',
    })
    this.addShortcode<BaseShortcodeAttributes>({
      shortcode: 'date',
      handler: () => new Date().toLocaleDateString(),
    })
    this.addShortcode<BaseShortcodeAttributes>({
      shortcode: 'time',
      handler: () => new Date().toLocaleTimeString(),
    })

    if (this.settings.shortcodes?.length) {
      this.settings.shortcodes.forEach(sc => this.addShortcode(sc))
    }
  }

  // Add shortcode with proper typing
  public addShortcode<
    TAttrs extends BaseShortcodeAttributes = BaseShortcodeAttributes,
  >(args: {
    shortcode: string
    handler: ShortcodeHandler<TAttrs>
  },
  ): void {
    const { shortcode, handler } = args
    if (!shortcode.match(/^[\w\-@]+$/))
      throw new Error('Invalid shortcode name')

    this.shortcodes[shortcode] = handler as ShortcodeHandler

    if (handler.constructor.name === 'AsyncFunction') {
      this.hasAsyncShortcodes = true
    }
  }

  public async parseString(input: string): Promise<{ text: string, matches: ShortcodeMatch[] }> {
    return this.parseStringInternal(input, true)
  }

  public parseStringSync(input: string): { text: string, matches: ShortcodeMatch[] } {
    if (this.hasAsyncShortcodes) {
      throw new Error('Synchronous parsing is not possible when async shortcodes are present')
    }
    return this.parseStringInternal(input, false) as { text: string, matches: ShortcodeMatch[] }
  }

  private parseStringInternal(input: string, isAsync: boolean):
    { text: string, matches: ShortcodeMatch[] } | Promise<{ text: string, matches: ShortcodeMatch[] }> {
    const matches = this.parseToMatches(input)
    let result = ''
    let lastIndex = 0

    const processMatches = async () => {
      for (const match of matches) {
        const { shortcode, content, attributes, fullMatch } = match
        const startIndex = input.indexOf(fullMatch, lastIndex)
        result += input.slice(lastIndex, startIndex)
        lastIndex = startIndex + fullMatch.length

        if (fullMatch.startsWith('\\')) {
          result += fullMatch.slice(1) // Handle escaped shortcode by removing backslash
          continue
        }

        const handler = this.shortcodes[shortcode.trim()]
        if (!handler) {
          this.log.warn(`No handler found for shortcode: ${shortcode}`, { data: match })
          result += fullMatch
          continue
        }

        const processedContent = content ? (await this.parseStringInternal(content, isAsync)).text : ''
        const processed = await handler({ content: processedContent, attributes, fullMatch })
        result += processed
      }
      result += input.slice(lastIndex)
      return { text: result, matches }
    }

    if (isAsync) {
      return processMatches()
    }
    else {
      for (const match of matches) {
        const { shortcode, content, attributes, fullMatch } = match
        const startIndex = input.indexOf(fullMatch, lastIndex)
        result += input.slice(lastIndex, startIndex)
        lastIndex = startIndex + fullMatch.length

        if (fullMatch.startsWith('\\')) {
          result += fullMatch.slice(1) // Handle escaped shortcode by removing backslash
          continue
        }

        const handler = this.shortcodes[shortcode.trim()]
        if (!handler) {
          this.log.warn(`No handler found for shortcode: ${shortcode}`, { data: match })
          result += fullMatch
          continue
        }

        const processedContent = content ? (this.parseStringInternal(content, false) as { text: string }).text : ''
        const processed = handler({ content: processedContent, attributes, fullMatch }) as string
        result += processed
      }
      result += input.slice(lastIndex)
      return { text: result, matches }
    }
  }

  parseToMatches(input: string): ShortcodeMatch[] {
    // Updated regex to match [@...] instead of [...]
    const regex = /\\?\[@\s*([\w\-@]+)(?:\s+([^[\]]+?))?\s*\](?:((?:.|\n)*?)\[\/@\1\])?/g
    return Array.from(input.matchAll(regex))
      .map(([fullMatch, shortcode, attrString, content = '']) => ({
        shortcode,
        content,
        attributes: this.parseAttributes(attrString),
        fullMatch,
      }))
  }

  parseAttributes(attrString?: string): BaseShortcodeAttributes {
    if (!attrString)
      return {}
    const regex = /([\w\-@]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/g
    const attributes: BaseShortcodeAttributes = {}
    attrString.replace(/\\+"/g, '"').replace(/\\+'/g, '\'').replace(regex, (_, name, dq, sq, uq) => {
      let value = dq || sq || uq || ''
      // Convert to number if the string is numeric
      if (/^-?\d+(\.\d+)?$/.test(value)) {
        value = Number(value)
      }
      attributes[name] = value
      return ''
    })
    return attributes
  }

  public async parseObject(obj: any): Promise<any> {
    if (Array.isArray(obj))
      return Promise.all(obj.map(item => this.parseObject(item)))
    if (isPlainObject(obj)) {
      const entries = await Promise.all(
        Object.entries(obj).map(async ([key, value]) => {
          try {
            return [key, await this.parseObject(value)]
          }
          catch (error) {
            this.log.error(`Error processing ${key}`, { error })
            return null
          }
        }),
      )
      return Object.fromEntries(entries.filter(Boolean) as [string, any][])
    }
    if (typeof obj === 'string' && this.containsShortcode(obj))
      return (await this.parseString(obj)).text
    return obj
  }

  public parseObjectSync(obj: any): any {
    if (this.hasAsyncShortcodes)
      throw new Error('Synchronous parsing not available with async shortcodes')

    if (Array.isArray(obj))
      return obj.map(item => this.parseObjectSync(item))

    if (isPlainObject(obj)) {
      const entries = Object.entries(obj).map(([key, value]) => [key, this.parseObjectSync(value)])
      return Object.fromEntries(entries)
    }

    if (typeof obj === 'string' && this.containsShortcode(obj))
      return this.parseStringSync(obj).text

    return obj
  }

  private containsShortcode(input: string): boolean {
    return /\[@\s*[\w\-@]+/.test(input)
  }
}

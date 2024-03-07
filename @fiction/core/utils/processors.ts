import { FictionObject } from '../plugin'
import type { FictionEnv } from '../plugin-env'
import { log } from '../plugin-log'
import { isPlainObject } from './obj'

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
      return Promise.all(obj.map(item => this.parseValue(item, parentKey)))
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
          return await processor.action(value)
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

export type ShortcodesConfig = {
  fictionEnv?: FictionEnv
}
type ShortcodeAttributes = Record<string, string>
type ShortcodeHandler = (args: { content?: string, attributes?: ShortcodeAttributes }) => Promise<string> | string

export class Shortcodes extends FictionObject<ShortcodesConfig> {
  private shortcodeDictionary: Record<string, ShortcodeHandler> = {}
  private objectProcessor: ObjectProcessor

  constructor(settings: ShortcodesConfig) {
    super('Shortcodes', settings)
    this.initializeShortcodeHandlers()
    this.objectProcessor = new ObjectProcessor([
      this.createShortcodeProcessor(),
    ])
  }

  private initializeShortcodeHandlers(): void {
    this.shortcodeDictionary = {
      cwd: async () => this.settings.fictionEnv?.cwd || '',
      date: async () => new Date().toLocaleDateString(),
      time: async () => new Date().toLocaleTimeString(),
      // Additional async shortcodes can be defined here
    }
  }

  public addShortcode(shortcode: string, handler: ShortcodeHandler): void {
    if (!shortcode.match(/^[a-zA-Z0-9_\-@]+$/))
      throw new Error('Invalid shortcode name')

    this.shortcodeDictionary[shortcode] = handler
  }

  private createShortcodeProcessor(): Processor<string> {
    return {
      condition: async ({ value }) => typeof value === 'string' && this.containsShortcode(value),
      action: async (value: string) => this.parseString(value),
    }
  }

  async parseString(input: string): Promise<string> {
    const regex = /(?:\\)?\[\s*([a-zA-Z0-9_\-@]+)(?:\s+([^[\]]+?))?\s*\](?:((?:.|\n)*?)\[\/\1\])?/g
    const matches = Array.from(input.matchAll(regex))
    let result = ''
    let lastIndex = 0

    for (const match of matches) {
      // TypeScript might worry `match.index` could be undefined. We ensure we only proceed if it's defined.
      if (typeof match.index === 'undefined')
        continue // Skip this iteration if match.index is undefined

      const [fullMatch, shortcode, attrString, content = ''] = match
      // Add text before the current match
      result += input.slice(lastIndex, match.index)
      // Update lastIndex to the end of the current match
      lastIndex = match.index + fullMatch.length

      if (fullMatch.startsWith('\\')) {
        result += fullMatch.slice(1) // Handle escaped shortcode by removing backslash
        continue
      }

      try {
        const handler = this.shortcodeDictionary[shortcode]
        if (!handler) {
          this.log.warn(`No handler found for shortcode: ${shortcode}`)
          result += fullMatch // Append the original match if no handler is found
        }
        else {
          const attributes = this.parseAttributes(attrString)
          // Process nested shortcodes if content is not self-closing
          const processedContent = content ? await this.parseString(content) : ''
          // Execute handler and append processed result
          const processed = await handler({ content: processedContent, attributes })
          result += processed
        }
      }
      catch (e) {
        this.log.error('Error in shortcode:', { error: e as Error })
      }
    }

    // Append any remaining text after the last match
    result += input.slice(lastIndex)
    return result
  }

  private containsShortcode(input: string): boolean {
    const regex = /\[\s*([a-zA-Z0-9_\-@]+)(?:\s+([^[\]]+?))?\s*\]/
    return regex.test(input)
  }

  private parseAttributes(attrString: string | undefined): ShortcodeAttributes {
    const attributes: ShortcodeAttributes = {}
    if (attrString) {
      const attrRegex = /([a-zA-Z0-9_\-@]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g
      let match: RegExpExecArray | null

      // Perform the assignment before the loop and then check for nullity within the loop condition
      match = attrRegex.exec(attrString)
      while (match !== null) {
        const attrName = match[1]
        const attrValue = match[2] || match[3] || '' // Use the second or third group, or default to an empty string
        attributes[attrName] = attrValue

        // Perform the assignment at the end of the loop to prepare for the next iteration
        match = attrRegex.exec(attrString)
      }
    }
    return attributes
  }

  public async parseObject(obj: any): Promise<any> {
    return this.objectProcessor.parseObject(obj)
  }
}

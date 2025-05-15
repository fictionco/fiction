import type { EndpointMeta, EndpointResponse } from '@fiction/core'
import type { z } from 'zod'
import type { FictionAi, FictionAiSettings } from '.'
import { abort, Query, Shortcodes } from '@fiction/core'
import { createStockMediaHandler } from '@fiction/ui/stock'

// Types
type QueryAiSettings = { fictionAi: FictionAi } & FictionAiSettings

export type CommandMessage = {
  role: 'system' | 'assistant' | 'user'
  content: string
}

export type ContentFormat =
  | 'websiteCopy'
  | 'contentAutocomplete'
  | 'brandVoice'
  | 'accountSetup' // Added new format

// Request types
export type AiRequest =
  | {
    _action: 'completion'
    format?: ContentFormat
    prompt: string
    objectives?: Record<string, string>
    schema?: z.ZodType<any>
    schemaJson?: Record<string, unknown>
    referenceInfo?: string
    orgId?: string
    userId?: string
  }

// Response types
interface AiCompletionResult {
  completion?: Record<string, unknown>
  messages?: CommandMessage[]
}

// Main Query Class
export class QueryAi extends Query<QueryAiSettings> {
  async run(params: AiRequest, meta: EndpointMeta): Promise<EndpointResponse<AiCompletionResult>> {
    try {
      switch (params._action) {
        case 'completion':
          return await this.handleCompletion(params, meta)
        default:
          throw abort('Invalid action')
      }
    }
    catch (error) {
      this.log.error(`Error in ${params._action}`, { error })
      return {
        status: 'error',
        message: (error as Error).message,
      }
    }
  }

  private async handleCompletion(
    params: Extract<AiRequest, { _action: 'completion' }>,
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<AiCompletionResult>> {
    const { format, prompt, objectives, schema, schemaJson, referenceInfo } = params

    // Get model and system messages
    const { model } = await this.setupModel()
    const messages = await this.buildSystemMessages({ format, objectives, schema, schemaJson, referenceInfo })

    this.log.debug('Sending completion request', {
      data: {
        format,
        hasSchema: !!schema,
        prompt: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
      },
    })

    try {
      const { generateText } = await import('ai')
      // Generate completion
      const { text } = await generateText({
        model,
        system: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
        prompt,
        temperature: 0.7,
      })

      // Parse completion as JSON
      const rawCompletionObject = this.parseJsonFromCompletion(text)

      const completion = await this.parseShortcodes(rawCompletionObject)

      this.log.info('Completion successful', {
        data: { format, hasResult: !!completion },
      })

      return {
        status: 'success',
        data: {
          completion,
          messages,
        },
      }
    }
    catch (error) {
      this.log.error('Completion failed', { error })
      return {
        status: 'error',
        message: (error as Error).message,
        data: { messages },
      }
    }
  }

  shortcodes = new Shortcodes<{
    image_url: {
      orientation?: 'portrait' | 'landscape' | 'squarish'
      subject?: string
    }
  }>({
    fictionEnv: this.settings.fictionEnv,
    shortcodes: [
      { shortcode: 'image_url', handler: async (args) => {
        const { attributes } = args

        const orientation = attributes?.orientation || 'squarish'
        const subject = attributes?.subject || 'person'

        const stock = await createStockMediaHandler()

        const mediaItem = stock.getRandomByAspectRatio(orientation, { tags: ['object', 'image'] })

        //  const search = attributes?.search || ''
        // const description = attributes?.description || ''
        // const _prompt = [
        //   `Prompt: ${search}`,
        //   `Format: ${description || 'none'}`,
        //   `Constraints: make SURE the image has no text, logos, or watermarks on it.`,
        //   `Style: ${objectives.imageStyle}.`,

        // ].filter(Boolean).join('\n')

        // const start = Date.now()
        // this.log.info('creating image', { data: { prompt, orientation, orgId, userId } })
        // const r = await this.settings.fictionAi.queries.AiImage.serve({ _action: 'createImage', prompt, orientation, orgId, userId }, { server: true })

        // if (r.status === 'error' || !r.data) {
        //   message = 'There was a "safety" API error during image generation. Try again, change image style if needed.'
        //   more = 'This happens when images are similar to trademarked works, etc...'
        //   throw new Error(message)
        // }

        // this.log.info(`created image in ${Math.round((Date.now() - start) / 1000)}s`, { data: { r } })
        return mediaItem.url
      } },

    ],
  })

  private async parseShortcodes(rawCompletion: Record<string, unknown>) {
    const shortcodes = new Shortcodes({ fictionEnv: this.settings.fictionEnv })

    shortcodes.addShortcode<{
      search?: string
      description?: string
      orientation?: 'portrait' | 'landscape' | 'squarish'
      subject?: 'person' | 'object'
    }>({ shortcode: 'image_url', handler: async (args) => {
      const { attributes } = args

      const orientation = attributes?.orientation || 'squarish'
      const subject = attributes?.subject || 'person'

      const stock = await createStockMediaHandler()

      const mediaItem = stock.getRandomByAspectRatio(orientation, { tags: ['object', 'image'] })

      //  const search = attributes?.search || ''
      // const description = attributes?.description || ''
      // const _prompt = [
      //   `Prompt: ${search}`,
      //   `Format: ${description || 'none'}`,
      //   `Constraints: make SURE the image has no text, logos, or watermarks on it.`,
      //   `Style: ${objectives.imageStyle}.`,

      // ].filter(Boolean).join('\n')

      // const start = Date.now()
      // this.log.info('creating image', { data: { prompt, orientation, orgId, userId } })
      // const r = await this.settings.fictionAi.queries.AiImage.serve({ _action: 'createImage', prompt, orientation, orgId, userId }, { server: true })

      // if (r.status === 'error' || !r.data) {
      //   message = 'There was a "safety" API error during image generation. Try again, change image style if needed.'
      //   more = 'This happens when images are similar to trademarked works, etc...'
      //   throw new Error(message)
      // }

      // this.log.info(`created image in ${Math.round((Date.now() - start) / 1000)}s`, { data: { r } })
      return mediaItem.url
    } })

    return await shortcodes.parseObject(rawCompletion)
  }

  // Helper methods
  private async setupModel() {
    const { generateText } = await import('ai')
    const { createAnthropic } = await import('@ai-sdk/anthropic')

    // Initialize Anthropic model
    const anthropic = createAnthropic({
      apiKey: this.settings.anthropicApiKey,
    })

    const model = anthropic('claude-3-7-sonnet-20250219')

    return {
      model,
      generateText,
    }
  }

  private parseJsonFromCompletion(text: string): Record<string, unknown> {
    try {
      // Extract JSON content from possible code blocks or raw JSON
      const jsonContent = text.replace(/^```json\s*|\s*```$/g, '').trim()
      return JSON.parse(jsonContent)
    }
    catch (error) {
      this.log.error('Failed to parse completion as JSON', {
        data: { error, textLength: text.length },
      })
      throw new Error('Invalid JSON response from AI')
    }
  }

  private async buildSystemMessages(args: {
    format?: ContentFormat
    objectives?: Record<string, string>
    schema?: z.ZodType<any>
    schemaJson?: Record<string, unknown>
    referenceInfo?: string
  }): Promise<CommandMessage[]> {
    const { schema, schemaJson, referenceInfo } = args

    let outputFormat: Record<string, unknown> = {}

    // Add schema if provided
    if (schema) {
      const { default: zodToJsonSchema } = await import('zod-to-json-schema')
      outputFormat = zodToJsonSchema(schema)
    }
    else if (schemaJson) {
      outputFormat = schemaJson
    }

    // // Get appropriate system message based on format
    // switch (format) {
    //   case 'websiteCopy':
    //     formatGuidelines = this.getWebsiteCopyGuidelines()
    //     break
    //   case 'contentAutocomplete':
    //     formatGuidelines = this.getAutocompleteGuidelines()
    //     break
    //   case 'brandVoice':
    //     formatGuidelines = this.getBrandVoiceGuidelines()
    //     break
    //   case 'accountSetup':
    //     formatGuidelines = this.getAccountSetupGuidelines()
    //     break
    //   default:
    //     throw abort(`Unsupported format: ${format}`)
    // }

    // Build messages array
    const messages: CommandMessage[] = [
      {
        role: 'system',
        content: `<output_format_instructions>
  - You MUST return ONLY valid JSON that EXACTLY follows the schema provided below.
  - You MUST use the EXACT property names as specified in the schema.
  - You MUST NOT add additional properties not defined in the schema.
  - You MUST NOT rename or modify the property names under any circumstances.
  - The output MUST be parseable as JSON.
  - Return NOTHING except valid JSON conforming to this schema:

  ${JSON.stringify(outputFormat, null, 2)}

  This is a strict requirement Using incorrect property names will cause system failures.
  </output_format_instructions>`,
      },
    ]

    // Add reference info if provided
    if (referenceInfo) {
      messages.push({
        role: 'system',
        content: `<reference_info>${referenceInfo}</reference_info>`,
      })
    }

    // Add a final reminder about schema adherence
    messages.push({
      role: 'system',
      content: `<critical_reminder>
  Remember, your response MUST output ONLY JSON use the exact property names "${Object.keys(outputFormat.properties || {}).join('", "')}" as specified in the schema.
  </critical_reminder>`,
    })

    return messages
  }

  // System message templates
  private getWebsiteCopyGuidelines(): string {
    return `<expert_copywriter>
You are an elite copywriter with 20+ years of experience creating sharp, concise marketing copy.
Your goal is to craft compelling, customer-centric content that converts.

<principles>
- Write with precision and clarity - every word must earn its place
- Focus on customer pain points and practical solutions
- Use direct language that builds credibility and trust
- Employ neurolinguistic patterns that motivate action
- Create copy that's both SEO-effective and human-engaging
</principles>

<avoid>
- Clichés, buzzwords, and marketing jargon
- Excessive adjectives and adverbs
- Hyperbole and unsubstantiated claims
- Generic statements that could apply to any business
- Redundancy and unnecessary words
</avoid>
</expert_copywriter>`
  }

  private getAutocompleteGuidelines(): string {
    return `<autocomplete_assistant>
You are an elite writing assistant specializing in precise, engaging suggestions.

<output_guidelines>
- Provide concise, impactful completions (3-16 words)
- Focus on strong nouns and active verbs
- Avoid clichés and predictable phrases
- Match the existing tone and flow
- Add specific details, data points, or unexpected insights
- Create natural transitions between ideas
- Trim all unnecessary words
</output_guidelines>
</autocomplete_assistant>`
  }

  private getBrandVoiceGuidelines(): string {
    return `<brand_strategist>
You are a top brand strategist who develops unique, authentic brand voices.

<voice_principles>
- Create distinctive tonal patterns that stand out in the market
- Balance brand authenticity with audience resonance
- Develop language frameworks that convey brand values
- Craft messaging that triggers emotional responses
- Design verbal identity elements that enhance brand recognition
</voice_principles>

<voice_components>
- Word choice and vocabulary range
- Sentence structure and rhythm
- Storytelling approach and narrative framing
- Use of metaphors, analogies and industry terminology
- Balance of logical and emotional appeals
</voice_components>
</brand_strategist>`
  }

  // New account setup guidelines
  private getAccountSetupGuidelines(): string {
    return `<profile_specialist>
You are an expert identity consultant who helps professionals craft authentic, impactful digital presences.

<core_principles>
- Emphasize genuine expertise and unique perspectives
- Balance professionalism with distinct personality traits
- Transform vague generalities into specific, memorable details
- Capture voice and character in minimal word count
- Identify and highlight true differentiators
</core_principles>

<writing_approach>
- Use concrete details instead of abstract claims
- Create tight sentences with purposeful structure
- Choose unexpected verbs and precise nouns
- Integrate subtle narrative elements that create interest
- Focus on genuine achievements rather than self-promotion
</writing_approach>

<avoid>
- LinkedIn-style corporate buzzwords
- Generic professional clichés (e.g., "passionate", "dedicated")
- Personality trait lists without supporting context
- Overused intro formulas and empty phrases
- Self-designated expertise without evidence
- Alignment with obvious industry values everyone shares
</avoid>

<output_aims>
- Create descriptions people immediately recognize as "sounding like them but better"
- Develop bios that stand out in crowded professional spaces
- Balance being distinctive with relevant industry expectations
- Find fresh approaches to standard profile elements
- Craft content that feels simultaneously authentic and aspirational
</output_aims>
</profile_specialist>`
  }

  private async getOpenAiApi() {
    const { default: OpenAI } = await import('openai')
    return new OpenAI({
      apiKey: this.settings.openaiApiKey,
      dangerouslyAllowBrowser: true,
    })
  }
}

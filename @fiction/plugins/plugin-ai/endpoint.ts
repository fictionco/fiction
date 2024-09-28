import type { EndpointMeta, EndpointResponse, TableMediaConfig } from '@fiction/core'
import type { PineconeRecord, RecordMetadata } from '@pinecone-database/pinecone'
import type { FictionAi, FictionAiSettings } from '.'
import type { SourceItem } from './tables'
import { abort, objectId, Query, Shortcodes } from '@fiction/core'

import { stockMediaHandler } from '@fiction/ui/stock'
import { Pinecone } from '@pinecone-database/pinecone'
import { generateText } from 'ai'
import { Document, TextSplitter } from './splitter'
import { contentCommandUtil } from './systemMessage'

type QueryAiSettings = { fictionAi: FictionAi } & FictionAiSettings

export type CommandMessage = { role: 'system' | 'assistant' | 'user', content: string }

interface AiResult {
  referenceInfo?: string
  completion?: Record<string, unknown>
  messages?: CommandMessage[]
}

export type ContentFormat =
  | { format: 'websiteCopy', outputFormat: Record<string, unknown> }
  | { format: 'contentAutocomplete' }

export type AiCompletionSettings = {
  _action: 'similaritySearch' | 'completion'
  runPrompt: string
  searchNamespace?: string
  useSimilaritySearch?: boolean
  referenceInfo?: string
  orgId: string
  userId: string
  objectives: Record<string, string>
} & ContentFormat

export abstract class QueryAi extends Query<QueryAiSettings> {
  constructor(settings: QueryAiSettings) {
    super(settings)
  }

  async getPineconeIndex(namespace: string) {
    if (!this.settings.pineconeApiKey)
      throw abort('pineconeApiKey required')

    if (!this.settings.pineconeIndex)
      throw abort('pineconeIndex required')

    const pc = new Pinecone({
      apiKey: this.settings.pineconeApiKey,
    })

    return pc.index(this.settings.pineconeIndex).namespace(namespace)
  }

  async getAiModels() {
    const { createOpenAI } = await import('@ai-sdk/openai')
    const { createAnthropic } = await import('@ai-sdk/anthropic')

    const anthropic = createAnthropic({
      apiKey: this.settings.anthropicApiKey,
    })

    const openai = createOpenAI({
      apiKey: this.settings.openaiApiKey,
    })

    return { openai, anthropic }
  }

  async getOpenAiApi() {
    const { default: OpenAI } = await import('openai')
    // we don't actually run in browser, but is needed as it just checks for window
    return new OpenAI({ apiKey: this.settings.openaiApiKey, dangerouslyAllowBrowser: true })
  }

  flatten(obj: Record<string, unknown>, prefix = ''): RecordMetadata {
    const flattened: Record<string, unknown> = {}

    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key
        const value = obj[key]

        if (value !== null && value !== undefined) {
          if (typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(
              flattened,
              this.flatten(value as Record<string, unknown>, newKey),
            )
          }
          else {
            flattened[newKey] = value
          }
        }
      }
    }

    return flattened as RecordMetadata
  }

  async getEmbeddings(documents: Document[]): Promise<PineconeRecord[]> {
    const openAi = await this.getOpenAiApi()
    const p = documents.map(async (doc) => {
      const text = doc.pageContent
      const embeddings = await openAi.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
      })

      const values = embeddings.data[0].embedding

      return {
        id: objectId(),
        values,
        metadata: this.flatten({ ...doc.metadata, text }),
      }
    })
    return Promise.all(p)
  }

  async similaritySearch(args: { runPrompt: string, searchNamespace: string }) {
    const { runPrompt, searchNamespace } = args
    const pineconeIndex = await this.getPineconeIndex(searchNamespace)

    // get vector embedding for content
    const emb = await this.getEmbeddings([new Document({ pageContent: runPrompt })])

    // see closest matches
    const r = await pineconeIndex.query({ vector: emb[0].values, topK: 3, includeMetadata: true })

    return (
      r.matches?.map((m) => {
        const data = m.metadata as Record<string, unknown>
        return new Document({ pageContent: data.text as string, metadata: data })
      }) || []
    )
  }

  async getChatCompletion(args: AiCompletionSettings): Promise<EndpointResponse<AiResult>> {
    const { useSimilaritySearch, searchNamespace, runPrompt } = args

    const { anthropic } = await this.getAiModels()

    if (useSimilaritySearch) {
      if (!searchNamespace)
        throw abort('searchNamespace required')

      const sourceDocuments = await this.similaritySearch({ runPrompt, searchNamespace })

      const searchResultText = sourceDocuments.map(d => d.pageContent).join('\n\n')

      args.referenceInfo += searchResultText
    }

    const messages = contentCommandUtil.getMessages(args)

    const generateArgs = {
      system: messages.map(m => `content(${m.role}): ${m.content}`).join('\n'),
      prompt: runPrompt || 'Follow guidelines for provided objectives.',
      temperature: 0.7,
    }

    this.log.info('sending messages', { data: { generateArgs } })

    const { text } = await generateText({ model: anthropic('claude-3-5-sonnet-20240620'), ...generateArgs })

    // const response = await openAi.chat.completions.create({
    //   model: 'gpt-4-turbo-preview',
    //   max_tokens: 1000,
    //   n: 1,
    //   messages,
    //   response_format: { type: 'json_object' },
    // })

    const rawCompletion = text

    const shortcodes = new Shortcodes({ fictionEnv: this.settings.fictionEnv })

    const message = ''
    const more = ''
    shortcodes.addShortcode<{
      search?: string
      description?: string
      orientation?: 'portrait' | 'landscape' | 'squarish'
      subject?: 'person' | 'object'
    }>('stock_img', async (args) => {
      const { attributes } = args

      const orientation = attributes?.orientation || 'squarish'
      const subject = attributes?.subject || 'person'

      const mediaItem = await stockMediaHandler.getRandomByAspectRatio(orientation, { tags: ['object', 'image'] })

      //  const search = attributes?.search || ''
      // const description = attributes?.description || ''
      // const _prompt = [
      //   `Prompt: ${search}`,
      //   `Format: ${description || 'none'}`,
      //   `Contraints: make SURE the image has no text, logos, or watermarks on it.`,
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
    })

    this.log.info('parsing raw completion', { data: { rawCompletion } })

    let completion
    try {
      const parsedCompletion = await shortcodes.parseObject(rawCompletion)
      completion = JSON.parse(parsedCompletion)
      this.log.info('returning completion', { data: { completion } })
    }
    catch (e) {
      this.log.error('error parsing completion', { data: { e, rawCompletion } })
      return { status: 'error', data: { messages } }
    }

    return {
      status: 'success',
      message,
      more,
      data: {
        completion,
        messages,
      },
    }
  }
}

interface ManageVectorsParams {
  _action: 'indexDocuments' | 'clearDocuments'
  orgId: string
  namespace: string
  data?: SourceItem[]
}
export class QueryManageVectors extends QueryAi {
  async addVectors(args: { documents: Document[], namespace: string }) {
    const { documents, namespace } = args
    const pineconeIndex = await this.getPineconeIndex(namespace)

    // Pinecone recommends a limit of 100 vectors per upsert request
    const chunkSize = 50
    for (let i = 0; i < documents.length; i += chunkSize) {
      const chunk = documents.slice(i, i + chunkSize)
      const records = await this.getEmbeddings(chunk)

      records.forEach((record, ii) => {
        this.log.info(`indexing vectors len:${documents.length} ${i}-${ii}`, {
          data: { namespace, record },
        })
      })
      await pineconeIndex.upsert(records)
    }
  }

  async run(
    params: ManageVectorsParams,
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<unknown>> {
    const { _action, orgId, namespace } = params

    if (!_action)
      throw abort('action required')
    if (!orgId)
      throw abort('userId required')

    const message: string | undefined = undefined
    const data: unknown = undefined

    const pineconeIndex = await this.getPineconeIndex(namespace)

    if (_action === 'clearDocuments') {
      this.log.warn(`clearing vectors in ${namespace} namespace`)
      await pineconeIndex.deleteAll()
    }
    else if (_action === 'indexDocuments') {
      const docs
        = params.data?.map((d) => {
          return new Document({
            pageContent: d.pageContent as string,
            metadata: d.metadata,
          })
        }) || []

      const splitter = new TextSplitter({ chunkSize: 1000, chunkOverlap: 100 })

      const splitDocs = await splitter.splitDocuments(docs)

      this.log.info(`documents ${docs.length} split to ${splitDocs.length}`)

      await this.addVectors({ documents: splitDocs, namespace })
    }

    return { status: 'success', data, message, params }
  }
}

type AiCompletionParams = {
  _action: 'similaritySearch' | 'completion'
} & AiCompletionSettings

export class AiCompletion extends QueryAi {
  async run(
    params: AiCompletionParams,
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<AiResult>> {
    const { _action, runPrompt, searchNamespace } = params

    if (!_action)
      throw abort('action required')

    const data: AiResult = { referenceInfo: '', messages: [] }

    if (_action === 'similaritySearch') {
      if (!searchNamespace)
        throw abort('searchNamespace required')

      const r = await this.similaritySearch({ runPrompt, searchNamespace })
      data.referenceInfo = r.map(d => d.pageContent).join('\n\n')
      return { status: 'success', data, params }
    }
    else if (_action === 'completion') {
      return this.getChatCompletion(params)
    }
    else {
      throw abort('invalid action')
    }
  }
}

type AiImageParams = {
  _action?: 'createImage'
  prompt: string
  orientation: 'landscape' | 'portrait' | 'squarish'
  orgId: string
  userId: string
}

export class AiImage extends QueryAi {
  async run(
    params: AiImageParams,
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<TableMediaConfig>> {
    const { _action, orientation = 'squarish', prompt, orgId, userId } = params

    const fictionMedia = this.settings.fictionMedia

    if (!fictionMedia)
      throw abort('fictionMedia required')

    if (!_action)
      throw abort('action required')

    let data: TableMediaConfig | undefined = undefined

    const openAi = await this.getOpenAiApi()

    const sizes = { landscape: '1792x1024', portrait: '1024x1792', squarish: '1024x1024' } as const

    const size = sizes[orientation] || sizes.squarish

    try {
      const response = await openAi.images.generate({ model: 'dall-e-3', prompt, n: 1, size })

      const url = response.data[0].url

      if (!url)
        throw abort('no image url returned')

      const r = await fictionMedia.queries.ManageMedia.serve({ _action: 'createFromUrl', orgId, userId, fields: { prompt, sourceImageUrl: url } }, _meta)

      if (r?.status === 'success') {
        this.log.info('ai image created', { data: r.data })
        data = r.data?.[0]
      }

      return { status: 'success', data, params }
    }
    catch (error) {
      const message = `error creating image (${(error as Error).message})`
      this.log.error(message, { error })
      return { status: 'error', message, data }
    }
  }
}

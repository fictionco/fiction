import type { EndpointMeta, EndpointResponse, TableMediaConfig } from '@fiction/core'
import { Query, Shortcodes, toLabel } from '@fiction/core'
import type { PineconeRecord, RecordMetadata } from '@pinecone-database/pinecone'
import { Pinecone } from '@pinecone-database/pinecone'
import OpenAI from 'openai'
import type { SourceItem } from './tables'
import { Document, TextSplitter } from './splitter'
import type { FictionAi, FictionAiSettings } from '.'

type QueryAiSettings = { fictionAi: FictionAi } & FictionAiSettings

type CommandMessage = { role: 'system' | 'assistant' | 'user', content: string }

interface AiResult {
  referenceInfo?: string
  completion?: Record<string, unknown>
  messages?: CommandMessage[]
  assistantResponse?: OpenAI.Beta.Threads.Messages.ThreadMessagesPage
}

type AiCompletionSettings = {
  baseInstruction: string
  runPrompt: string
  outputFormat?: Record<string, unknown>
  searchNamespace?: string
  useSimilaritySearch?: boolean
  referenceInfo?: string
  objectives: {
    about?: string
    goal?: string
    targetCustomer?: string
    targetAction?: string
    imageStyle?: string
  }
  orgId: string
  userId: string
}

export abstract class QueryAi extends Query<QueryAiSettings> {
  constructor(settings: QueryAiSettings) {
    super(settings)
  }

  async getPineconeIndex(namespace: string) {
    if (!this.settings.pineconeApiKey)
      throw this.stop('pineconeApiKey required')

    if (!this.settings.pineconeIndex)
      throw this.stop('pineconeIndex required')

    const pc = new Pinecone({
      apiKey: this.settings.pineconeApiKey,
    })

    return pc.index(this.settings.pineconeIndex).namespace(namespace)
  }

  getOpenAiApi() {
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
    const openAi = this.getOpenAiApi()
    const p = documents.map(async (doc) => {
      const text = doc.pageContent
      const embeddings = await openAi.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
      })

      const values = embeddings.data[0].embedding

      return {
        id: this.utils.objectId(),
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
    const { useSimilaritySearch, baseInstruction, searchNamespace, runPrompt, outputFormat, objectives, orgId, userId } = args
    let { referenceInfo = '' } = args

    if (!baseInstruction)
      throw this.stop('basePrompt required')

    const openAi = this.getOpenAiApi()

    if (useSimilaritySearch) {
      if (!searchNamespace)
        throw this.stop('searchNamespace required')

      const sourceDocuments = await this.similaritySearch({ runPrompt, searchNamespace })

      const searchResultText = sourceDocuments.map(d => d.pageContent).join('\n\n')

      referenceInfo += searchResultText
    }

    const imageInstruction = [
      `Image style should not affect text content.`,
      `For image URLs, use shortcodes as [stock_img search="(image_prompt)" orientation="(portrait, landscape, or squarish)"],`,
      `replacing image_prompt with a 5-15 word image generation prompt creates a context related image and adds style terms related to image style objective.`,
      `Be creative and specific, employing analogies, metaphors, and similes to enrich the description.`,
    ].join(' ')

    const messages: CommandMessage[] = [
      { role: 'system', content: `follow these orders EXACTLY and return JSON based on inputs provided: ${baseInstruction}.\n${imageInstruction}` },
    ]

    if (outputFormat) {
      const outputFormatText = JSON.stringify(outputFormat)
      messages.push({ role: 'system', content: `Generate JSON content that conforms to the following schema: ${outputFormatText}. Ensure the response is structured according to this schema.` })
    }

    let objectiveText = ''
    if (objectives) {
      objectiveText = Object.entries(objectives).map(([key, val]) => `${toLabel(key)}: ${val}`).join(`\n`)
      messages.push({ role: 'system', content: `objectives: ${objectiveText}` })
    }

    if (referenceInfo)
      messages.push({ role: 'system', content: `reference info: ${referenceInfo}\n` })

    if (runPrompt)
      messages.push({ role: 'user', content: runPrompt })

    this.log.info('sending messages', { data: { messages, outputFormat } })

    const response = await openAi.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      max_tokens: 1000,
      n: 1,
      messages,
      response_format: { type: 'json_object' },
    })

    const rawCompletion = response.choices[0].message.content

    const shortcodes = new Shortcodes({ fictionEnv: this.settings.fictionEnv })

    shortcodes.addShortcode('stock_img', async (args) => {
      const { attributes } = args
      const search = attributes?.search || ''
      const orientation = attributes?.orientation as 'portrait' | 'landscape' || 'squarish'

      const prompt = [
        search,
        `Contraints: make SURE the image has no text, logos, or watermarks on it.`,
        `style: ${objectives.imageStyle}.`,
        `context: ${objectiveText || 'website'}`,
      ].join('\n')

      const start = Date.now()
      this.log.info('creating image', { data: { prompt, orientation, orgId, userId } })
      const r = await this.settings.fictionAi.queries.AiImage.serve({ _action: 'createImage', prompt, orientation, orgId, userId }, { server: true })

      this.log.info(`created image in ${Math.round((Date.now() - start) / 1000)}s`, { data: { r } })
      return r.data?.url || ''
    })

    this.log.info('parsing raw completion', { data: { rawCompletion } })

    const parsedCompletion = await shortcodes.parseObject(rawCompletion)

    let completion
    try {
      completion = JSON.parse(parsedCompletion)
      this.log.info('returning completion', { data: { completion } })
    }
    catch (e) {
      this.log.error('error parsing completion', { data: { e, rawCompletion, parsedCompletion } })
      return { status: 'error', message: 'error parsing completion', data: { referenceInfo, messages } }
    }

    return { status: 'success', data: {
      referenceInfo,
      completion,
      messages,
    } }
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
      throw this.stop('action required')
    if (!orgId)
      throw this.stop('userId required')

    const message: string | undefined = undefined
    const data: unknown = undefined

    const pineconeIndex = await this.getPineconeIndex(namespace)

    if (_action === 'clearDocuments') {
      this.log.warn(`clearing vectors in ${namespace} namespace`)
      await pineconeIndex.deleteOne({ namespace, deleteAll: true })
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
      throw this.stop('action required')

    const data: AiResult = { referenceInfo: '', messages: [] }

    if (_action === 'similaritySearch') {
      if (!searchNamespace)
        throw this.stop('searchNamespace required')

      const r = await this.similaritySearch({ runPrompt, searchNamespace })
      data.referenceInfo = r.map(d => d.pageContent).join('\n\n')
      return { status: 'success', data, params }
    }
    else if (_action === 'completion') {
      return await this.getChatCompletion(params)
    }
    else {
      throw this.stop('invalid action')
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
      throw this.stop('fictionMedia required')

    if (!_action)
      throw this.stop('action required')

    let data: TableMediaConfig | undefined = undefined

    const openAi = this.getOpenAiApi()

    const sizes = { landscape: '1792x1024', portrait: '1024x1792', squarish: '1024x1024' } as const

    const size = sizes[orientation] || sizes.squarish

    const response = await openAi.images.generate({ model: 'dall-e-3', prompt, n: 1, size })

    const url = response.data[0].url

    if (!url)
      throw this.stop('no image url returned')

    const r = await fictionMedia.queries.ManageMedia.serve({ _action: 'createFromUrl', orgId, userId, fields: { prompt, sourceImageUrl: url } }, _meta)

    if (r?.status === 'success') {
      this.log.info('ai image created', { data: r.data })
      data = r.data
    }

    return { status: 'success', data, params }
  }
}

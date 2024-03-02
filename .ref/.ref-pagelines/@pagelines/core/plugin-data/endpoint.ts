import type {
  EndpointMeta,
  EndpointResponse,
  FactorDb,
} from '@factor/api'
import {
  Query,
} from '@factor/api'
import { PineconeClient } from '@pinecone-database/pinecone'
import OpenAI from 'openai'

import type { SourceItem } from '../tables'
import { Document, TextSplitter } from './util'
import type { PageLinesData } from '.'

interface UsageQuerySettings {
  factorDb: FactorDb
  pageLinesData: PageLinesData
}

export abstract class QueryData extends Query<UsageQuerySettings> {
  factorDb = this.settings.factorDb
  pageLinesData = this.settings.pageLinesData
  constructor(settings: UsageQuerySettings) {
    super(settings)
  }

  async getPineconeIndex() {
    const client = new PineconeClient()
    await client.init({
      apiKey: this.pageLinesData.pineconeApiKey,
      environment: this.pageLinesData.pineconeEnvironment,
    })
    const pineconeIndex = client.Index(this.pageLinesData.pineconeIndex)

    return pineconeIndex
  }

  getOpenAiApi() {
    const openai = new OpenAI({
      apiKey: this.pageLinesData.openAIApiKey, // This is also the default, can be omitted
    })

    return openai
  }

  flatten(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
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

    return flattened
  }

  async getEmbeddings(documents: Document[]) {
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
}

interface ManageVectorsParams {
  _action: 'indexDocuments' | 'clearDocuments'
  organizationId: string
  namespace: string
  data?: SourceItem[]
}
export class QueryManageVectors extends QueryData {
  async addVectors(args: { documents: Document[], namespace: string }) {
    const { documents, namespace } = args
    const pineconeIndex = await this.getPineconeIndex()

    // Pinecone recommends a limit of 100 vectors per upsert request
    const chunkSize = 50
    for (let i = 0; i < documents.length; i += chunkSize) {
      const chunk = documents.slice(i, i + chunkSize)
      const embeds = await this.getEmbeddings(chunk)

      embeds.forEach((embed, ii) => {
        this.log.info(`indexing vectors len:${documents.length} ${i}-${ii}`, {
          data: { namespace, embed },
        })
      })
      await pineconeIndex.upsert({
        upsertRequest: { vectors: embeds, namespace },
      })
    }
  }

  async run(
    params: ManageVectorsParams,
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<unknown>> {
    const { _action, organizationId, namespace } = params

    if (!_action)
      throw this.stop('action required')
    if (!organizationId)
      throw this.stop('userId required')

    const message: string | undefined = undefined
    const data: unknown = undefined

    const pineconeIndex = await this.getPineconeIndex()

    if (_action === 'clearDocuments') {
      this.log.warn(`clearing vectors in ${namespace} namespace`)
      await pineconeIndex.delete1({ namespace, deleteAll: true })
    }
    else if (_action === 'indexDocuments') {
      const docs
        = params.data?.map((d) => {
          return new Document({
            pageContent: d.pageContent as string,
            metadata: d.metadata,
          })
        }) || []

      const splitter = new TextSplitter({
        chunkSize: 1000,
        chunkOverlap: 100,
      })

      const splitDocs = await splitter.splitDocuments(docs)

      this.log.info(`documents ${docs.length} split to ${splitDocs.length}`)

      await this.addVectors({ documents: splitDocs, namespace })
    }

    return { status: 'success', data, message, params }
  }
}

interface VectorSearchParams {
  _action: 'similaritySearch' | 'questionAnswer'
  content: string
  metaFilters?: Record<string, string>
  basePrompt?: string
  namespace: string
  memoryKey?: string
}

interface VectorSearchResponse {
  sourceDocuments: Document[]
  completion: OpenAI.Chat.Completions.ChatCompletion
}
export class QueryVectorSearch extends QueryData {
  async similaritySearch(args: {
    content: string
    namespace: string
    metaFilters: Record<string, string>
  }) {
    const { content, namespace } = args
    const pineconeIndex = await this.getPineconeIndex()

    const emb = await this.getEmbeddings([
      new Document({ pageContent: content }),
    ])

    const r = await pineconeIndex.query({
      queryRequest: {
        vector: emb[0].values,
        topK: 3,
        includeMetadata: true,
        namespace,
      },
    })

    return (
      r.matches?.map((m) => {
        const data = m.metadata as Record<string, unknown>
        return new Document({
          pageContent: data.text as string,
          metadata: data,
        })
      }) || []
    )
  }

  async run(
    params: VectorSearchParams,
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<VectorSearchResponse>> {
    const {
      _action,
      content,
      basePrompt,
      namespace,
      memoryKey,
    } = params

    if (!_action)
      throw this.stop('action required')

    const data: VectorSearchResponse = {
      completion: {} as OpenAI.Chat.Completions.ChatCompletion,
      sourceDocuments: [],
    }
    if (_action === 'similaritySearch') {
      const r = await this.similaritySearch({
        content,
        namespace,
        metaFilters: {},
      })
      data.sourceDocuments = r
    }
    else if (_action === 'questionAnswer') {
      if (!basePrompt)
        throw this.stop('basePrompt required')
      const openAi = this.getOpenAiApi()

      const sourceDocuments = await this.similaritySearch({
        content,
        namespace,
        metaFilters: {},
      })

      const docOutput = sourceDocuments.map(d => d.pageContent).join('\n\n')

      const messages: {
        role: 'system' | 'assistant' | 'user'
        content: string
      }[] = [
        {
          role: 'system',
          content: `follow these orders exactly: ${basePrompt}`,
        },
        {
          role: 'system',
          content: `reference info: ${docOutput}\n`,
        },
        {
          role: 'user',
          content,
        },
      ]

      this.log.info('sending messages', {
        data: { messages, namespace, memoryKey },
      })

      const response = await openAi.chat.completions.create({
        model: 'gpt-3.5-turbo',
        max_tokens: 1000,
        n: 1,
        messages,
      })

      this.log.info('sending messages', {
        data: { response },
      })

      data.sourceDocuments = sourceDocuments
      data.completion = response
    }
    return { status: 'success', data, params }
  }
}

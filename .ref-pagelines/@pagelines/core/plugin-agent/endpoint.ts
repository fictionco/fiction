import type {
  DataFilter,
  EndpointMeta,
  EndpointResponse,
  FactorDb,
} from '@factor/api'
import {
  Query,
  sortByKey,
} from '@factor/api'
import * as axios from 'axios'
import * as cheerio from 'cheerio'
import xml2js from 'xml2js'
import TurndownService from 'turndown'
import type {
  SourceItem,
  TableAgentConfig,
  TableMessageConfig,
  TableSourceConfig,
} from '../tables'
import type { PageLinesData } from '../plugin-data'
import { ChatAgent, Message } from './obj'
import type { PageLinesAgent } from '.'

interface UsageQuerySettings {
  factorDb: FactorDb
  pageLinesAgent: PageLinesAgent
  pageLinesData: PageLinesData
}

export abstract class QueryAgent extends Query<UsageQuerySettings> {
  factorDb = this.settings.factorDb
  pageLinesAgent = this.settings.pageLinesAgent
  pageLinesData = this.settings.pageLinesData
  constructor(settings: UsageQuerySettings) {
    super(settings)
  }

  async findOne(agentId: string) {
    if (!agentId)
      throw this.stop('agentId required')

    const { agent: ag, source: src } = this.tbl

    const db = this.factorDb.client()

    const r = await db(ag)
      .select([
        `${ag}.*`,
        db.raw(
          `CASE WHEN COUNT(??) > 0 THEN json_agg(to_jsonb(??) ORDER BY ??) ELSE '[]' END as sources`,
          [`${src}.agent_id`, src, `${src}.created_at`],
        ),
      ])
      .leftJoin(src, `${src}.agent_id`, '=', `${ag}.agent_id`)
      .where({
        [`${ag}.agentId`]: agentId,
      })
      .groupBy(`${ag}.agent_id`)
      .first<TableAgentConfig | undefined>()

    return r
  }

  async parseSitemap(sitemapUrl: string): Promise<string[]> {
    try {
      const { data: xml } = await axios.default.get(sitemapUrl)
      const parser = new xml2js.Parser()
      const sitemap = (await parser.parseStringPromise(xml as string)) as {
        urlset: { url: { loc: string[] }[] }
      }
      return sitemap.urlset.url.map(url => url.loc[0])
    }
    catch (error) {
      console.error(`parsing sitemap from ${sitemapUrl}:`, error)
      return []
    }
  }

  ensureValidUrl(url: string, currentUrl: string): string | undefined {
    try {
      const parsedUrl = new URL(url, currentUrl)

      if (parsedUrl.host !== new URL(currentUrl).host)
        return undefined

      // Check if the URL has a valid file extension for a web page
      const validExtensions = ['.html', '.htm', '.php', '.asp', '.aspx', '']
      const ext = parsedUrl.pathname.split('.').pop()?.toLowerCase()
      const urlExtension = parsedUrl.pathname.includes('.') && ext ? ext : ''

      if (!validExtensions.includes(urlExtension))
        return undefined

      parsedUrl.hash = ''
      parsedUrl.search = ''
      // Remove trailing slash if present and if the URL is not the root path
      const href = parsedUrl.toString().replace(/\/+$/, '')

      return href
    }
    catch {
      return undefined
    }
  }

  async urlContent(params: {
    urls: string[]
    limit?: number
    shouldCrawl?: boolean
  }): Promise<SourceItem[]> {
    const { urls, limit = 50, shouldCrawl = false } = params
    const visitedUrls: Set<string> = new Set()
    const queue: string[] = []
    const sourceItems: SourceItem[] = []
    const entryUrl = urls[0]

    const isSitemapMode = entryUrl.endsWith('.xml')
    if (isSitemapMode) {
      const sitemapUrls = await this.parseSitemap(entryUrl)
      queue.push(...sitemapUrls)
    }
    else {
      queue.push(...urls)
    }

    while (queue.length > 0 && Object.keys(sourceItems).length < limit) {
      const currentUrl = queue.shift()!
      if (visitedUrls.has(currentUrl))
        continue

      visitedUrls.add(currentUrl)

      try {
        const { data: html } = await axios.default.get(currentUrl)
        const $ = cheerio.load(html as string)
        $(
          'script, style, noscript, iframe, header, footer, nav, .hidden, .hide, img, figure',
        ).remove()

        const textContent = $('body').html()
        const title = $('title').text()
        const description = $('meta[name="description"]').attr('content') || ''
        const image = $('meta[property="og:image"]').attr('content') || ''
        const icon = $('link[rel="icon"]').attr('href') || ''

        const turndownService = new TurndownService()
        const markdown = turndownService.turndown(textContent || '')

        // Clean up extracted text using regular expressions
        const cleanedMarkdown = markdown
          .replaceAll(/[\t\n]+/g, ' ') // Replace newline and tab characters with a single space
          .replaceAll(/"([^"]*)"/g, '$1') // Remove double quotes
          .replaceAll(/<[^>]*>/g, '') // Remove all HTML tags
          .replaceAll(/\s{2,}/g, ' ') // Replace multiple spaces with a single space
          .trim() // Remove leading and trailing spaces

        sourceItems.push({
          pageContent: [cleanedMarkdown, title, description].join('\n'),
          metadata: {
            type: isSitemapMode ? 'sitemap' : 'url',
            key: currentUrl,
            name: currentUrl,
            url: currentUrl,
            length: markdown.length,
            title,
            description,
            image,
            icon,
          },
        })

        if (
          !isSitemapMode
          && Object.keys(sourceItems).length < limit
          && shouldCrawl
        ) {
          $('a[href]').each((_index, element) => {
            const href = $(element).attr('href')

            if (!href)
              return

            const validUrl = this.ensureValidUrl(href, currentUrl)

            if (validUrl && !visitedUrls.has(validUrl))
              queue.push(validUrl)
          })
        }
      }
      catch (error) {
        console.error(`Error fetching content from ${currentUrl}:`, error)
      }
    }

    return sourceItems
  }
}

interface PublicAgentParams {
  _action: 'retrieve' | 'getResponse'
  agentId: string
  anonymousId?: string
  text?: string
}
export class QueryPublicAgent extends QueryAgent {
  async run(
    params: PublicAgentParams,
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<Partial<TableAgentConfig>>> {
    const { _action, agentId } = params

    const r = await this.findOne(agentId)

    return { status: 'success', data: r }
  }
}

interface ManageAgentIndexParams {
  _action: 'delete' | 'list'
  userId?: string
  organizationId: string
  limit?: number
  offset?: number
  selectedIds?: string[]
  filters?: DataFilter[]
}
export class QueryManageAgentIndex extends QueryAgent {
  async run(
    params: ManageAgentIndexParams,
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<TableAgentConfig[]>> {
    const {
      _action,
      organizationId,
      limit = 40,
      offset = 0,
      filters = [],
    } = params

    if (!_action)
      throw this.stop('action required')

    const db = this.factorDb.client()

    const message: string | undefined = undefined
    let data: TableAgentConfig[] | undefined
    const { agent: agentTbl, source: sourceTbl } = this.tbl

    let count = 0
    if (_action === 'list') {
      const base = db
        .select([
          `${agentTbl}.*`,
          db.raw(
            `CASE WHEN COUNT(factor_user.user_id) > 0 THEN json_agg(row_to_json(factor_user.*) ORDER BY factor_user.user_id) ELSE '[]' END as author`,
          ),
          db.raw(
            `CASE WHEN COUNT(??) > 0 THEN json_agg(to_jsonb(??) ORDER BY ??) ELSE '[]' END as sources`,
            [`${sourceTbl}.agent_id`, sourceTbl, `${sourceTbl}.created_at`],
          ),
        ])
        .from(agentTbl)
        .where(`${agentTbl}.organization_id`, organizationId)
        .limit(limit)
        .offset(offset)
        .orderBy('updatedAt', 'desc')
        .leftJoin(
          'factor_user',
          `factor_user.user_id`,
          `=`,
          `${agentTbl}.user_id`,
        )
        .leftJoin(
          sourceTbl,
          `${sourceTbl}.agent_id`,
          `=`,
          `${agentTbl}.agent_id`,
        )
        .groupBy(`${agentTbl}.agent_id`)

      if (filters.length) {
        filters.forEach((filter) => {
          const { field, operator, value } = filter
          if (field && operator && value)
            void base.where(field, operator, value)
        })
      }

      const rows = await base

      data = rows

      const r = await db
        .count<{ count: string }>('*')
        .from(agentTbl)
        .where({ organizationId })
        .first()

      count = +(r?.count || 0)
    }

    this.log.info('running query', { data: { params, data, count } })

    return {
      status: 'success',
      data,
      message,
      indexMeta: { count, limit, offset },
      params,
    }
  }
}

interface ManageAgentParams {
  _action: 'upsert' | 'retrieve' | 'train'
  userId: string
  organizationId: string
  config?: Partial<TableAgentConfig>
}
export class QueryManageAgent extends QueryAgent {
  async train(agent: TableAgentConfig, meta: EndpointMeta) {
    const { agentId, organizationId, userId } = agent
    if (!agentId)
      throw this.stop('agentId required')
    if (!organizationId)
      throw this.stop('organizationId required')

    await this.pageLinesData.queries.ManageVectors.serve(
      {
        _action: 'clearDocuments',
        namespace: agentId,
        organizationId,
      },
      meta,
    )

    let count = 0
    const _promises = agent.sources?.map(async (source) => {
      const { sourceType, sourceName, sourceContent, sourceUrls } = source
      if (!agentId)
        throw this.stop('agentId required')

      const sourceItems: SourceItem[] = []
      if (sourceType === 'url') {
        const urls = sourceUrls?.map(s => s.url) || []
        const urlSourceItems = await this.urlContent({
          urls,
          shouldCrawl: false,
        })
        sourceItems.push(...urlSourceItems)

        source.sourceUrls = urlSourceItems.map(u => ({
          url: u.metadata.url || '',
          length: u.metadata.length || 0,
        }))
      }
      else if (sourceType === 'text') {
        sourceItems.push({
          pageContent: sourceContent,
          metadata: {
            type: 'text',
            key: sourceName,
            name: sourceName,
            organizationId,
            userId,
          },
        })
      }

      count += sourceItems.length

      await this.pageLinesData.queries.ManageVectors.serve(
        {
          _action: 'indexDocuments',
          data: sourceItems,
          namespace: agentId,
          organizationId,
        },
        meta,
      )

      return source
    })

    agent.sources = await Promise.all(_promises || [])

    return {
      status: 'success',
      data: agent,
      message: `indexed ${count} records`,
    }
  }

  async run(
    params: ManageAgentParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<Partial<TableAgentConfig>>> {
    const { _action, userId, config, organizationId } = params

    if (!_action)
      throw this.stop('action required')
    if (!userId)
      throw this.stop('userId required')

    if (!organizationId)
      throw this.stop('organizationId required')

    const db = this.factorDb.client()
    const nowIso = this.utils.dayjs().toISOString()
    let message: string | undefined
    const fields: Partial<TableAgentConfig> = this.utils.prepareFields({
      type: 'internal',
      fields: { organizationId, userId, ...config },
      table: this.tbl.agent,
      meta,
      factorDb: this.factorDb,
    })

    let agentId = config?.agentId
    let entry: TableAgentConfig | undefined
    if (_action === 'upsert' || _action === 'train') {
      fields.updatedAt = nowIso

      const query = db
        .table(this.tbl.agent)
        .insert(fields)
        .onConflict(`agent_id`)
        .merge(fields)
        .returning<TableAgentConfig[]>('*')

      const r = await query

      agentId = r[0].agentId

      // save sources options if any
      const p = config?.sources?.map(async (s) => {
        return await this.pageLinesAgent.queries.ManageDataSource.serve(
          { _action: 'upsert', config: s, organizationId, userId },
          meta,
        )
      })

      await Promise.all(p || [])

      message = 'saved'
    }

    if (!agentId)
      throw this.stop('agentId required')

    entry = await this.findOne(agentId)

    if (_action === 'train' && entry) {
      const r = await this.train(entry, meta)

      // update agent with any metadata added during training (length)
      if (r.data?.sources) {
        await Promise.all(
          r.data.sources?.map(async (s) => {
            return await this.pageLinesAgent.queries.ManageDataSource.serve(
              { organizationId, userId, config: s, _action: 'upsert' },
              meta,
            )
          }),
        )
      }

      entry = r.data
      message = r.message
    }

    return {
      status: 'success',
      data: entry,
      message,
      params,
    }
  }
}

interface ManageDataSourceParams {
  _action: 'crawl' | 'upsert'
  userId: string
  organizationId: string
  entryUrl?: string
  config?: Partial<TableSourceConfig>
}
export class QueryManageDataSource extends QueryAgent {
  async run(
    params: ManageDataSourceParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<Partial<TableSourceConfig>>> {
    const { _action, userId, config = {}, organizationId } = params

    if (!_action)
      throw this.stop('action required')
    if (!userId)
      throw this.stop('userId required')
    if (!organizationId)
      throw this.stop('organizationId required')

    const db = this.factorDb.client()
    const nowIso = this.utils.dayjs().toISOString()

    let message: string | undefined

    let entry: TableSourceConfig | undefined

    const f = { organizationId, userId, ...config }
    const fields: Partial<TableSourceConfig> = this.utils.prepareFields({
      type: 'internal',
      fields: f,
      table: this.tbl.source,
      meta,
      factorDb: this.factorDb,
    })

    if (_action === 'upsert' || _action === 'crawl') {
      fields.updatedAt = nowIso

      this.log.info('saving', { data: { f, fields } })

      let query = db
        .table(this.tbl.source)
        .insert(fields)
        .onConflict(`source_id`)
        .merge(fields)
        .returning<TableSourceConfig[]>('*')

      ;[entry] = await query

      message = 'saved'

      if (_action === 'crawl') {
        const { entryUrl } = params
        if (!entryUrl)
          throw this.stop('entryUrl required')

        const chunks = await this.urlContent({
          urls: [entryUrl],
          shouldCrawl: true,
        })

        if (!entry.sourceUrls)
          entry.sourceUrls = []

        chunks.forEach((c) => {
          if (!entry)
            return
          const {
            metadata: { url = '', length = 0 },
          } = c

          if (!entry.sourceUrls.some(u => u.url === c.metadata.url))
            entry.sourceUrls.push({ url, length })
        })

        message = `found ${chunks.length} valid urls`

        query = db
          .table(this.tbl.source)
          .update({
            sourceUrls: JSON.stringify(
              sortByKey({
                data: entry.sourceUrls,
                key: 'url',
              }),
            ),
          })
          .where({ sourceId: entry.sourceId })
          .returning<TableSourceConfig[]>('*')
        ;[entry] = await query
      }
    }

    return {
      status: 'success',
      data: entry,
      message,
      params,
    }
  }
}

interface ManageMessageParams {
  _action: 'userMessage'
  userId?: string
  organizationId?: string
  anonymousId: string
  agentConfig?: Partial<TableAgentConfig>
  messageConfig?: Partial<TableMessageConfig>
}

export class QueryManageMessage extends QueryAgent {
  fields(messageConfig: Partial<TableMessageConfig>, meta: EndpointMeta) {
    const fields: Partial<TableMessageConfig> = this.utils.prepareFields({
      type: 'internal',
      fields: messageConfig,
      table: this.tbl.message,
      meta,
      factorDb: this.factorDb,
    })

    return fields
  }

  async run(
    params: ManageMessageParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<Partial<TableMessageConfig>>> {
    const { _action, messageConfig, agentConfig, anonymousId } = params

    if (!_action)
      throw this.stop('action required')

    const db = this.factorDb.client()

    const agent = new ChatAgent({
      pageLinesAgent: this.pageLinesAgent,
      ...agentConfig,
    })

    let entry: Partial<TableMessageConfig> | undefined

    if (_action === 'userMessage') {
      if (!messageConfig)
        throw this.stop('message required')
      if (!agentConfig?.agentId)
        throw this.stop('agent required')
      if (!anonymousId)
        throw this.stop('anonymousId required')

      await db(this.tbl.message).insert(this.fields(messageConfig, meta))

      const sendContent = messageConfig.content || ''

      const r = await this.pageLinesData.queries.VectorSearch.serve(
        {
          _action: 'questionAnswer',
          content: sendContent,
          namespace: agentConfig.agentId,
          memoryKey: anonymousId,
          basePrompt: agent.basePrompt.value,
        },
        meta,
      )

      const content = r.data?.completion.choices[0].message?.content || ''

      const msg = new Message({
        agent,
        content,
        role: 'assistant',
      })

      entry = msg.toConfig()

      await db(this.tbl.message).insert(this.fields(msg.toConfig(), meta))
    }

    return {
      status: 'success',
      data: entry,
      params,
    }
  }
}

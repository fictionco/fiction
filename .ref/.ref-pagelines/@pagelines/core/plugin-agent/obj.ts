// @unocss-include
import { FactorObject, vue } from '@factor/api'
import type { FrameUtility } from '@factor/ui/elBrowserFrameUtil'
import type {
  TableAgentConfig,
  TableMessageConfig,
  TableSourceConfig,
} from '../tables'
import { themeList } from './themes'
import type { PageLinesAgent } from '.'

export type MessageSettings = {
  agent: ChatAgent
  loading?: boolean
} & Partial<TableMessageConfig>

export class Message extends FactorObject<MessageSettings> {
  agent = this.settings.agent
  messageId = vue.ref(
    this.settings.messageId || this.utils.objectId({ prefix: 'msg' }),
  )

  organizationId = this.settings.organizationId
  userId = this.settings.userId
  anonymousId = vue.ref(
    this.settings.anonymousId || this.utils.getAnonymousId().anonymousId,
  )

  role = vue.ref(this.settings.role)
  content = vue.ref(this.settings.content)
  threadId = vue.ref(this.settings.threadId)
  loading = vue.ref(this.settings.loading)
  author = this.settings.author
  updatedAt = this.settings.updatedAt
  createdAt = this.settings.createdAt
  sending = vue.ref(false)
  isOwn = vue.computed(() => {
    return this.role.value === 'user'
  })

  constructor(settings: MessageSettings) {
    super('Message', settings)
  }

  update(config: Partial<MessageSettings>) {
    const entries = Object.entries(config)
    entries.forEach(([key, value]) => {
      const k = key as keyof MessageSettings
      const v = value
      const t = this as unknown as Record<keyof MessageSettings, vue.Ref>
      if (v !== undefined && t[k] && vue.isRef(t[k]))
        t[k].value = v
    })
    return this
  }

  toConfig(): Partial<MessageSettings> {
    return {
      userId: this.userId,
      organizationId: this.organizationId,
      messageId: this.messageId.value,
      agentId: this.agent.agentId.value,
      role: this.role.value,
      anonymousId: this.anonymousId.value,
      content: this.content.value,
    }
  }
}

export type DataSourceSettings = {
  agent: ChatAgent
} & Partial<TableSourceConfig>

export class DataSource extends FactorObject<DataSourceSettings> {
  agent = this.settings.agent
  sourceId = vue.ref(
    this.settings.sourceId || this.utils.objectId({ prefix: 'ds' }),
  )

  sourceName = vue.ref(this.settings.sourceName || '')
  sourceType = vue.ref(this.settings.sourceType || 'url')
  sourceContent = vue.ref(this.settings.sourceContent || '')
  sourceUrls = vue.ref(this.settings.sourceUrls || [])
  organizationId = this.settings.organizationId
  userId = this.settings.userId
  description = vue.ref(this.settings.description)
  author = this.settings.author
  updatedAt = this.settings.updatedAt
  createdAt = this.settings.createdAt
  sending = vue.ref(false)
  totalCharacters = vue.computed(() => {
    const c = this.sourceContent.value.length
    const urlLength = this.sourceUrls.value.reduce((a, b) => a + b.length, 0)
    return c + urlLength
  })

  constructor(settings: DataSourceSettings) {
    super('DataSource', settings)
  }

  update(config: Partial<TableSourceConfig>) {
    const entries = Object.entries(config)
    entries.forEach(([key, value]) => {
      const k = key as keyof TableSourceConfig
      const v = value
      const t = this as unknown as Record<keyof TableSourceConfig, vue.Ref>
      if (v !== undefined && t[k] && vue.isRef(t[k]))
        t[k].value = v
    })
  }

  toConfig(): Partial<TableSourceConfig> {
    return {
      userId: this.userId,
      organizationId: this.organizationId,
      sourceId: this.sourceId.value,
      sourceName: this.sourceName.value || '',
      sourceContent: this.sourceContent.value || '',
      sourceUrls: this.sourceUrls.value || [],
      sourceType: this.sourceType.value || '',
      description: this.description.value || '',
      agentId: this.agent.agentId.value,
    }
  }

  async crawl(args: { url: string }) {
    const { url } = args
    const config = this.toConfig()

    if (!config)
      throw new Error('no config')

    this.sending.value = true

    const r
      = await this.agent.pageLinesAgent.requests.ManageDataSource.projectRequest({
        _action: 'crawl',
        entryUrl: url,
        config,
      })

    if (r.data)
      this.update(r.data)

    this.sending.value = false

    return r
  }
}

export type ChatSettings = {
  pageLinesAgent: PageLinesAgent
  key?: string
  messages?: Message[]
} & Partial<TableAgentConfig>

const defs: Partial<TableAgentConfig> = {
  basePrompt: `Act as a document that I am having a conversation with. Your name is "AI Assistant". Provide me with answers from the reference data. If the answer is not included, say exactly "Hmm, I am not sure." and stop. Only answer questions about the reference info and don't break character.`,
  baseModel: `gpt-3.5-turbo`,
  options: {
    messagesInitial: `Hi!\nWhat can I help you with?`,
    messagesSuggested: '',
    theme: 'light',
    profileUrl: [],
    iconUrl: [],
    position: 'br',
    trigger: 'button',
    mode: 'modal',
  },
}

export class ChatAgent extends FactorObject<ChatSettings> {
  pageLinesAgent = this.settings.pageLinesAgent
  agentId = vue.ref(this.settings.agentId)
  agentName = vue.ref(this.settings.agentName || '')
  description = vue.ref(this.settings.description)
  organizationId = this.settings.organizationId
  userId = this.settings.userId
  options = vue.ref({ ...defs.options, ...this.settings.options })
  baseModel = vue.ref(this.settings.baseModel || defs.baseModel)
  basePrompt = vue.ref(this.settings.basePrompt || defs.basePrompt)
  status = vue.ref(this.settings.status || 'pending')
  editEmbedUrl = vue.computed(() => {
    return `${this.pageLinesAgent.editEmbedUrl.value}/${this.agentId.value}`
  })

  tagEmbedUrl = vue.computed(() => {
    return `${this.pageLinesAgent.baseUrl.value}/${this.agentId.value}`
  })

  messagesInitial = vue.computed(() => {
    const m = this.options.value.messagesInitial
    return (
      m
        ?.split('\n')
        .flatMap(_ => _.split(','))
        .filter(Boolean) || []
    )
  })

  messagesSuggested = vue.computed(() => {
    const m = this.options.value.messagesSuggested
    return (
      m
        ?.split('\n')
        .flatMap(_ => _.split(','))
        .filter(Boolean) || []
    )
  })

  author = this.settings.author
  updatedAt = this.settings.updatedAt
  createdAt = this.settings.createdAt
  statusDetails = vue.ref(this.settings.statusDetails || {})
  messages = vue.shallowRef<Message[]>(this.settings.messages || [])
  sources = vue.ref(
    this.settings.sources && this.settings.sources.length > 0
      ? this.settings.sources
      : [{}],
  )

  sourcesFull = vue.computed(() => {
    return this.sources.value.map(c => new DataSource({ agent: this, ...c }))
  })

  totalCharacters = vue.computed(() => {
    return this.sourcesFull.value.reduce(
      (a, b) => a + b.totalCharacters.value,
      0,
    )
  })

  theme = this.utils.vue.computed(() => {
    const themeId = 'light'
    return themeList.find(t => t.themeId === themeId) || themeList[0]
  })

  // entry element component for agent
  el = this.theme.value.el(this)
  frameUtility?: FrameUtility<PostMessageAgent>

  constructor(settings: ChatSettings) {
    super('ChatAgent', settings)
  }

  update(config: Partial<TableAgentConfig>) {
    const entries = Object.entries(config)
    entries.forEach(([key, value]) => {
      const k = key as keyof TableAgentConfig
      const v = value
      const t = this as unknown as Record<keyof TableAgentConfig, vue.Ref>
      if (v !== undefined && t[k] && vue.isRef(t[k]))
        t[k].value = v
    })
  }

  toConfig(): Partial<TableAgentConfig> {
    return {
      organizationId: this.organizationId,
      agentId: this.agentId.value,
      agentName: this.agentName.value || '',
      description: this.description.value || '',
      status: this.status.value,
      options: this.options.value,
      baseModel: this.baseModel.value,
      basePrompt: this.basePrompt.value,
      sources: this.sourcesFull.value.map(s => s.toConfig()),
    }
  }

  async save() {
    const config = this.toConfig()

    if (!config)
      throw new Error('no config')

    const r = await this.pageLinesAgent.requests.ManageAgent.projectRequest({
      _action: 'upsert',
      config,
    })

    return r
  }

  async reset() {
    this.messages.value = []
    this.utils.resetUi({ scope: 'all', cause: 'resetAgent' })
  }

  async close() {
    if (this.frameUtility) {
      this.frameUtility.sendMessage({
        message: { messageType: 'close', data: true },
      })
    }
  }

  async addMessageWithDelay(message: Message, delay: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.messages.value = [...this.messages.value, message]

        resolve(true)
      }, delay)
    })
  }

  async initializeMessages() {
    this.messages.value = []
    const m = this.messagesInitial.value.length

    if (m > 0) {
      const delayBetweenMessages = 500 // Set the delay between messages (in milliseconds)

      for (const content of this.messagesInitial.value) {
        const message = new Message({ agent: this, content, role: 'assistant' })

        await this.addMessageWithDelay(message, delayBetweenMessages)
      }
    }
  }

  async userMessage(args: { content: string }) {
    const { content } = args
    const message = new Message({ agent: this, content, role: 'user' })

    this.messages.value = [...this.messages.value, message]

    const responseMessage = new Message({
      agent: this,
      role: 'assistant',
      loading: true,
    })

    await this.addMessageWithDelay(responseMessage, 500)

    const result = await this.pageLinesAgent.requests.ManageMessage.request({
      _action: 'userMessage',
      agentConfig: this.toConfig(),
      messageConfig: message.toConfig(),
      anonymousId: message.anonymousId.value,
      organizationId: this.organizationId,
    })

    if (result.data) {
      responseMessage.update({ ...result.data, loading: false })
      this.utils.emitEvent('chat:scrollBottom')
    }
  }
}

export type PostMessageAgent =
  | {
    messageType: 'setAgent'
    data: Partial<TableAgentConfig>
  }
  | { messageType: 'resetUi', data: object }

import type {
  ProgressStatus,
  StatusDetails,
  User,
  UserFont,
} from '@factor/api'
import {
  FactorDbCol,
  FactorDbTable,
  snakeCaseKeys,
} from '@factor/api'
import type { GradientSetting, MediaDisplayObject } from '@factor/ui/utils'
import type { CreateObjectType } from '@factor/api/tbl'
import { standardTable } from '@factor/api/tbl'
import type { EmbedProps } from './plugin-embed/util'

interface st { updatedAt?: string, createdAt?: string }

export type TableAgentConfig = CreateObjectType<typeof agentTableColumns> &
  st & {
    author?: User
    sources?: Partial<TableSourceConfig>[]
  }

export type TableSourceConfig = CreateObjectType<typeof sourceTableColumns> &
  st & {
    author?: User
  }

export type TableMessageConfig = CreateObjectType<typeof messageTableColumns> &
  st & {
    author?: User
  }

export type AgentOptions = {
  displayName: string
  topic: string
  description: string
  messagesSuggested: string
  messagesInitial: string
  emailContact: string
  emailReport: string
  theme: string
  colorAction: string
  colorActionAlt: string
  colorButton: string
  position: string
  iconProfile: string
  iconProfileCustom: string[]
  iconButton: string
  iconButtonCustom: string[]
  keyboardShortcut: string
  bgColor: string
  bgImage?: MediaDisplayObject[]
  bgGradient?: GradientSetting
  themeFont?: UserFont
  bgMode?: 'color' | 'image' | 'gradient'
  [key: string]: unknown // needed for v-model
} & EmbedProps

export type SourceItemMetaData = {
  type?: 'url' | 'file' | 'text' | 'sitemap'
  key?: string
  name?: string
  url?: string
  length?: number
  organizationId?: string
  userId?: string
  title?: string
  description?: string
  image?: string
  icon?: string
}

export interface SourceItem {
  pageContent?: string
  metadata: SourceItemMetaData
}

export const agentTableColumns = [
  new FactorDbCol({
    key: 'agentId',
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`generate_object_id('ag')`))
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'organizationId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`${standardTable.org}.organization_id`)
        .onUpdate('CASCADE')
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'userId',
    create: ({ schema, column }) => {
      schema.string(column.pgKey, 32).references(`factor_user.user_id`)
    },
    default: () => '',
  }),

  new FactorDbCol({
    key: 'agentName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'description',
    create: ({ schema, column }) => schema.string(column.pgKey, 10_000),
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'baseModel',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'basePrompt',
    create: ({ schema, column }) => schema.string(column.pgKey, 10_000),
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'visibility',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'domains',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'status',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as ProgressStatus,
  }),
  new FactorDbCol({
    key: 'statusDetails',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    prepare: ({ value }) => JSON.stringify(snakeCaseKeys(value)),
    default: () => ({} as StatusDetails),
  }),

  new FactorDbCol({
    key: 'options',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    prepare: ({ value }) => JSON.stringify(snakeCaseKeys(value)),
    default: () => ({} as Partial<AgentOptions>),
  }),
] as const

export const sourceTableColumns = [
  new FactorDbCol({
    key: 'sourceId',
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`generate_object_id('so')`))
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'organizationId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`${standardTable.org}.organization_id`)
        .onUpdate('CASCADE')
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'userId',
    create: ({ schema, column }) => {
      schema.string(column.pgKey, 32).references(`factor_user.user_id`)
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'agentId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`${standardTable.agent}.agent_id`)
        .onUpdate('CASCADE')
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'sourceName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'sourceContent',
    create: ({ schema, column }) => schema.text(column.pgKey),
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'sourceUrls',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    prepare: ({ value }) => JSON.stringify(value),
    default: () => ({} as { url: string, length: number }[]),
  }),
  new FactorDbCol({
    key: 'description',
    create: ({ schema, column }) => schema.string(column.pgKey, 10_000),
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'sourceType',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as 'url' | 'file' | 'text' | 'sitemap',
  }),
] as const

export const threadTableColumns = [
  new FactorDbCol({
    key: 'threadId',
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`generate_object_id('so')`))
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'organizationId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`${standardTable.org}.organization_id`)
        .onUpdate('CASCADE')
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'agentId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`${standardTable.agent}.agent_id`)
        .onUpdate('CASCADE')
    },
    default: () => '',
  }),
]

export const messageTableColumns = [
  new FactorDbCol({
    key: 'messageId',
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`generate_object_id('so')`))
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'content',
    create: ({ schema, column }) => schema.text(column.pgKey),
    default: () => '',
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'organizationId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`${standardTable.org}.organization_id`)
        .onUpdate('CASCADE')
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'agentId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`${standardTable.agent}.agent_id`)
        .onUpdate('CASCADE')
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'userId',
    create: ({ schema, column }) => {
      schema.string(column.pgKey, 32).references(`factor_user.user_id`)
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'anonymousId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
  }),

  new FactorDbCol({
    key: 'role',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as 'user' | 'assistant' | 'system',
  }),
  new FactorDbCol({
    key: 'threadId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`${standardTable.thread}.thread_id`)
        .onUpdate('CASCADE')
    },
    default: () => '',
  }),
] as const

export const tables = [
  new FactorDbTable({
    tableKey: standardTable.agent,
    timestamps: true,
    columns: agentTableColumns,
  }),
  new FactorDbTable({
    tableKey: standardTable.source,
    timestamps: true,
    columns: sourceTableColumns,
  }),
  new FactorDbTable({
    tableKey: standardTable.thread,
    timestamps: true,
    columns: threadTableColumns,
  }),
  new FactorDbTable({
    tableKey: standardTable.message,
    timestamps: true,
    columns: messageTableColumns,
  }),
]

import { AppTable } from '@factor/api/plugin-admin'
import type {
  CreateObjectType,
} from '@kaption/core/utils/db'
import {
  KaptionDbCol,
  KaptionDbTable,
} from '@kaption/core/utils/db'
import type { OAuthPayload } from '.'

const connectTableColumns = [
  new KaptionDbCol({
    key: 'connectId',
    isComposite: true,
    create: ({ schema }) => {
      schema.primary(['project_id', 'provider', 'context'])
    },
    default: () => '',
  }),

  new KaptionDbCol({
    key: 'provider',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
  }),

  new KaptionDbCol({
    key: 'context',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
  }),

  new KaptionDbCol({
    key: 'status',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as 'pending' | 'active' | 'error' | 'disabled',
    isSetting: true,
  }),

  new KaptionDbCol({
    key: 'statusMessage',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
    isSetting: true,
  }),

  new KaptionDbCol({
    key: 'projectId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`${AppTable.Projects}.project_id`)
        .onUpdate('CASCADE')
    },
    default: () => '',
  }),

  new KaptionDbCol({
    key: 'organizationId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`${AppTable.Organizations}.organization_id`)
        .onUpdate('CASCADE')
    },
    default: () => '',
  }),

  new KaptionDbCol({
    key: 'apiKey',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
  }),

  new KaptionDbCol({
    key: 'oAuthPayload',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    default: () => ({} as Partial<OAuthPayload>),
    prepare: ({ value }) => JSON.stringify(value),
  }),

  new KaptionDbCol({
    key: 'meta',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    default: () => '',
    prepare: ({ value }) => JSON.stringify(value),
    isSetting: true,
  }),

  new KaptionDbCol({
    key: 'createdByUserId',
    create: ({ schema, column }) => {
      schema.string(column.pgKey, 32).references(`factor_user.user_id`)
    },
    default: () => '',
  }),

  new KaptionDbCol({
    key: 'destination',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as 'create' | 'existing',
    isSetting: true,
  }),

  new KaptionDbCol({
    key: 'channelGroupId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
    isSetting: true,
  }),

  new KaptionDbCol({
    key: 'channelGroupName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
    isSetting: true,
  }),

  new KaptionDbCol({
    key: 'channelName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
    isSetting: true,
  }),

  new KaptionDbCol({
    key: 'channelId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
    isSetting: true,
  }),

  new KaptionDbCol({
    key: 'channelUserId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
    isSetting: true,
  }),

  new KaptionDbCol({
    key: 'channelUrl',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
    isSetting: true,
  }),

  new KaptionDbCol({
    key: 'channelSetupUrl',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
    isSetting: true,
  }),

  new KaptionDbCol({
    key: 'listId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
    isSetting: true,
  }),

  new KaptionDbCol({
    key: 'listName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
    isSetting: true,
  }),

  new KaptionDbCol({
    key: 'columns',
    create: ({ schema, column }) =>
      schema.specificType(column.pgKey, 'text ARRAY'),
    default: () => [] as string[],
    isSetting: true,
  }),

  new KaptionDbCol({
    key: 'webHooks',
    create: ({ schema, column }) =>
      schema.specificType(column.pgKey, 'text ARRAY'),
    default: () => [] as string[],
    isSetting: true,
  }),
] as const

export const tbl = new KaptionDbTable({
  tableKey: 'kaption_connect',
  timestamps: true,
  columns: connectTableColumns,
})

export type IntegrationRow = CreateObjectType<typeof connectTableColumns>

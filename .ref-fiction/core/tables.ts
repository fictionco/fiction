import type {
  ProgressStatus,
  StatusDetails,
  User,
} from '@factor/api'
import {
  FactorDbCol,
  FactorDbTable,
  snakeCaseKeys,
} from '@factor/api'
import type { CreateObjectType } from '@factor/api/tbl'
import { standardTable } from '@factor/api/tbl'
import type { NotifyMode } from './plugin-push'
import type { ModelConfigSettings, ModelMeta } from './plugin-app-dreambooth/types'
import type { PortableConcept } from './plugin-app-dreambooth/concept'

export const tableNameModel = 'fiction_model'

type st = { updatedAt?: string, createdAt?: string }

export type TableModelConfig = CreateObjectType<typeof modelTableColumns> &
  st & {
    author?: User
    renders: TableRenderConfig[]
  }

export type ModelConfigSaveData = Omit<
  Partial<TableModelConfig>,
  'templateConfig' | 'meta' | 'conceptsList'
> & {
  conceptsList?: string
  templateConfig?: string
  meta?: string
}

export type TableRenderConfig = CreateObjectType<typeof renderTableColumns> &
  st & {
    author?: User
    images: TableImageConfig[]
    isLiked?: boolean
  }

export type RenderConfigSaveData = Omit<
  Partial<TableModelConfig>,
  'renderConfig' | 'meta'
> & {
  renderConfig?: string
  meta?: string
}

export type TableImageConfig = CreateObjectType<typeof imageTableColumns> &
  st & {
    modelConfig?: Partial<TableModelConfig>
    renderConfig?: Partial<TableRenderConfig>
    author?: User
    isLiked?: boolean
  }

export type TableCollectionConfig = CreateObjectType<
  typeof collectionTableColumns
> & {
  author?: User
  media: Partial<TableImageConfig>[]
  hasMediaItem?: boolean
} & st

export type TableLikeConfig = CreateObjectType<typeof mediaLikeColumns> & st

export type TableJobConfig = CreateObjectType<typeof jobsTableColumns> &
  st & {
    stepPercent: number
    stepRange: number
    elapsedTime: number
    response: Record<string, unknown>
  }

export type JobSaveData = Omit<
  Partial<TableJobConfig>,
  'inputs' | 'meta' | 'outputs'
> & {
  inputs?: string
  outputs?: string
  meta?: string
}

export const modelTableColumns = [
  new FactorDbCol({
    key: 'modelId',
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`generate_object_id()`))
    },
    default: () => '',
  }),

  new FactorDbCol({
    key: 'modelDiffusersPath',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'modelCheckpointPath',
    create: ({ schema, column }) => schema.string(column.pgKey),
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
    key: 'modelName',
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
    key: 'status',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as ProgressStatus,
  }),
  new FactorDbCol({
    key: 'statusDetails',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    prepare: val => JSON.stringify(snakeCaseKeys(val)),
    default: () => ({} as StatusDetails),
  }),

  new FactorDbCol({
    key: 'requestedAt',
    create: ({ schema, column }) => schema.dateTime(column.pgKey),
    default: () => '',
  }),
  new FactorDbCol({
    key: 'completedAt',
    create: ({ schema, column }) => schema.dateTime(column.pgKey),
    default: () => '',
  }),
  new FactorDbCol({
    key: 'startedAt',
    create: ({ schema, column }) => schema.dateTime(column.pgKey),
    default: () => '',
  }),
  new FactorDbCol({
    key: 'thumbUrl',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
  }),

  new FactorDbCol({
    key: 'modelVersion',
    create: ({ schema, column }) => schema.integer(column.pgKey).defaultTo(1),
    default: () => 0,
    isSetting: true,
  }),

  new FactorDbCol({
    key: 'baseModel',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
    isSetting: true,
  }),

  new FactorDbCol({
    key: 'templateId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
    isSetting: true,
  }),

  new FactorDbCol({
    key: 'conceptsList',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    prepare: ({ value }) => JSON.stringify(snakeCaseKeys(value)),
    default: () => [] as PortableConcept[],
  }),

  new FactorDbCol({
    key: 'templateConfig',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    prepare: ({ value }) => JSON.stringify(snakeCaseKeys(value)),
    default: () => ({} as ModelConfigSettings),
  }),

  new FactorDbCol({
    key: 'userId',
    create: ({ schema, column }) => {
      schema.string(column.pgKey, 32).references(`factor_user.user_id`)
    },
    default: () => '',
  }),

  new FactorDbCol({
    key: 'meta',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    default: () => ({} as ModelMeta),
    prepare: ({ value }) => JSON.stringify(snakeCaseKeys(value)),
  }),
] as const

export interface RenderConfig {
  aspect: 'square' | 'portrait' | 'landscape' | 'wide' | 'tall'
  width: number
  height: number
  seed: number
  promptTemplate: string
  prompt: string
  negativePrompt: string
  numOutputs: number
  numInferenceSteps: number
  guidanceScale: number
  conceptTag: string
  addWatermark: boolean
  [key: string]: unknown
}

export type RenderInputConfig = RenderConfig & ModelConfigSettings

export const imageTableColumns = [
  new FactorDbCol({
    key: 'imageId',
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`generate_object_id()`))
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'status',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as ProgressStatus,
  }),
  new FactorDbCol({
    key: 'modelId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`${standardTable.model}.model_id`)
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'baseModel',
    create: ({ schema, column }) => {
      schema.string(column.pgKey, 300)
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'renderId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`${standardTable.render}.render_id`)
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
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
        .onDelete('CASCADE')
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'userId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`${standardTable.user}.user_id`)
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'filename',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
  }),
  new FactorDbCol({
    key: 'extension',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
  }),

  new FactorDbCol({
    key: 'url',
    create: ({ schema, column }) => schema.string(column.pgKey, 1000),
    default: () => '',
  }),
  new FactorDbCol({
    key: 'blurhash',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
  }),
  new FactorDbCol({
    key: 'mimetype',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '',
  }),
  new FactorDbCol({
    key: 'width',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    default: () => 0,
  }),
  new FactorDbCol({
    key: 'height',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    default: () => 0,
  }),
  new FactorDbCol({
    key: 'aspect',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => 0,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'title',
    create: ({ schema, column }) => schema.string(column.pgKey, 2000),
    default: () => '',
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'description',
    create: ({ schema, column }) => schema.string(column.pgKey, 2000),
    default: () => '',
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'alt',
    create: ({ schema, column }) => schema.string(column.pgKey, 2000),
    default: () => '',
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'size',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    default: () => 0,
  }),
  new FactorDbCol({
    key: 'isPrivate',
    create: ({ schema, column }) => schema.boolean(column.pgKey),
    default: () => false,
  }),
  new FactorDbCol({
    key: 'showcaseStatus',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => 'pending' as ProgressStatus,
  }),
  new FactorDbCol({
    key: 'meta',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    default: () => ({} as Record<string, unknown>),
  }),
  new FactorDbCol({
    key: 'statusDetails',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    default: () => ({} as StatusDetails),
  }),
  new FactorDbCol({
    key: 'renderConfig',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    default: () => ({} as Partial<RenderConfig>),
    prepare: ({ value }) => JSON.stringify(snakeCaseKeys(value)),
  }),
] as const

export const renderTableColumns = [
  new FactorDbCol({
    key: 'renderId',
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`generate_object_id()`))
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'renderName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'modelId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`${standardTable.model}.model_id`)
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'baseModel',
    create: ({ schema, column }) => {
      schema.string(column.pgKey, 300)
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
        .onDelete('CASCADE')
    },
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
    default: () => ({} as StatusDetails),
    prepare: ({ value }) => JSON.stringify(snakeCaseKeys(value)),
  }),
  new FactorDbCol({
    key: 'renderConfig',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    default: () => ({} as Partial<RenderConfig>),
    prepare: ({ value }) => JSON.stringify(snakeCaseKeys(value)),
  }),
  new FactorDbCol({
    key: 'userId',
    create: ({ schema, column }) => {
      schema.string(column.pgKey, 32).references(`factor_user.user_id`)
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'meta',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    default: () => ({} as Record<string, unknown>),
  }),
  new FactorDbCol({
    key: 'requestedAt',
    create: ({ schema, column }) => schema.dateTime(column.pgKey),
    default: () => '',
  }),
  new FactorDbCol({
    key: 'completedAt',
    create: ({ schema, column }) => schema.dateTime(column.pgKey),
    default: () => '',
  }),
  new FactorDbCol({
    key: 'startedAt',
    create: ({ schema, column }) => schema.dateTime(column.pgKey),
    default: () => '',
  }),
] as const

export const jobsTableColumns = [
  new FactorDbCol({
    key: 'jobId',
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`generate_object_id()`))
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
    key: 'jobType',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as 'train' | 'render' | 'start' | 'stop' | 'terminate',
  }),
  new FactorDbCol({
    key: 'processor',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as 'server' | 'aim',
  }),
  new FactorDbCol({
    key: 'notifyMode',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as NotifyMode,
  }),

  new FactorDbCol({
    key: 'title',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'message',
    create: ({ schema, column }) => schema.string(column.pgKey, 10_000),
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'completedUrl',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'percent',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    isSetting: true,
    default: () => 0,
  }),
  new FactorDbCol({
    key: 'description',
    create: ({ schema, column }) => schema.string(column.pgKey, 10_000),
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'inputs',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    prepare: ({ value }) => JSON.stringify(snakeCaseKeys(value)),
    default: () => ({} as Record<string, unknown>),
  }),
  new FactorDbCol({
    key: 'outputs',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    prepare: ({ value }) => JSON.stringify(snakeCaseKeys(value)),
    default: () => ({} as Record<string, unknown>),
  }),

  new FactorDbCol({
    key: 'status',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '' as ProgressStatus,
  }),
  new FactorDbCol({
    key: 'isQueued',
    create: ({ schema, column }) => schema.boolean(column.pgKey),
    isSetting: true,
    default: () => false,
  }),
  new FactorDbCol({
    key: 'idempotencyKey',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'statusDetails',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    prepare: ({ value }) => JSON.stringify(snakeCaseKeys(value)),
    isSetting: true,
    default: () => ({} as StatusDetails),
  }),

  new FactorDbCol({
    key: 'requestedAt',
    create: ({ schema, column }) => schema.dateTime(column.pgKey),
    default: () => '' as string | Date,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'startedAt',
    create: ({ schema, column }) => schema.dateTime(column.pgKey),
    default: () => '' as string | Date,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'completedAt',
    create: ({ schema, column }) => schema.dateTime(column.pgKey),
    default: () => '' as string | Date,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'progressId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'url',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'instanceId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'modelId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`fiction_model.model_id`)
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'baseModel',
    create: ({ schema, column }) => {
      schema.string(column.pgKey, 300)
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'renderId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`fiction_render.render_id`)
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
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
    key: 'meta',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    default: () => ({}),
    prepare: ({ value }) => JSON.stringify(snakeCaseKeys(value)),
  }),
] as const

export const collectionTableColumns = [
  new FactorDbCol({
    key: 'collectionId',
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`generate_object_id()`))
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'title',
    create: ({ schema, column }) => schema.string(column.pgKey),
    isSetting: true,
    default: () => '',
  }),

  new FactorDbCol({
    key: 'description',
    create: ({ schema, column }) => schema.string(column.pgKey, 10_000),
    prepare: ({ value }) => value,
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'slug',
    create: ({ schema, column }) => schema.string(column.pgKey).unique(),
    isSetting: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'organizationId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 32)
        .references(`${standardTable.org}.organization_id`)
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
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
    key: 'isPrivate',
    create: ({ schema, column }) => schema.boolean(column.pgKey),
    default: () => false,
  }),
  new FactorDbCol({
    key: 'meta',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    isSetting: true,
    default: () => ({} as Record<string, unknown>),
  }),
] as const

export const collectionMediaColumns = [
  new FactorDbCol({
    key: 'collectionMediaId',
    create: ({ schema }) => {
      schema.primary(['collection_id', 'image_id'])
    },
    isComposite: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'collectionId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey)
        .references(`fiction_collection.collection_id`)
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .index()
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'imageId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey)
        .references(`fiction_image.image_id`)
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .index()
    },
    default: () => '',
  }),
] as const

export const mediaLikeColumns = [
  new FactorDbCol({
    key: 'likeId',
    create: ({ schema }) => {
      schema.primary(['user_id', 'image_id'])
    },
    isComposite: true,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'userId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey)
        .references(`factor_user.user_id`)
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .index()
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'imageId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey)
        .references(`fiction_image.image_id`)
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .index()
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'isLiked',
    create: ({ schema, column }) => {
      schema.boolean(column.pgKey)
    },
    default: () => false,
  }),
] as const

export const followingColumns = [
  new FactorDbCol({
    key: 'followerId',
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`generate_object_id()`))
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'followerUserId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey)
        .references(`${standardTable.user}.user_id`)
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .index()
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'followingUserId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey)
        .references(`${standardTable.user}.user_id`)
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .index()
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'followingOrganizationId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey)
        .references(`${standardTable.org}.organization_id`)
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .index()
    },
    default: () => '',
  }),
] as const

export const commentColumns = [
  new FactorDbCol({
    key: 'commentId',
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`generate_object_id()`))
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'commentText',
    create: ({ schema, column }) => schema.string(column.pgKey, 10_000),
    isSetting: true,
    prepare: ({ value }) => value,
    default: () => '',
  }),
  new FactorDbCol({
    key: 'userId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey)
        .references(`${standardTable.user}.user_id`)
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .index()
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'imageId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey)
        .references(`${standardTable.image}.image_id`)
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .index()
    },
    default: () => '',
  }),
  new FactorDbCol({
    key: 'collectionId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey)
        .references(`${standardTable.collection}.collection_id`)
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .index()
    },
    default: () => '',
  }),
] as const

export const tables = [
  new FactorDbTable({
    tableKey: standardTable.model,
    timestamps: true,
    columns: modelTableColumns,
  }),
  new FactorDbTable({
    tableKey: standardTable.render,
    timestamps: true,
    columns: renderTableColumns,
  }),
  new FactorDbTable({
    tableKey: standardTable.image,
    timestamps: true,
    columns: imageTableColumns,
  }),
  new FactorDbTable({
    tableKey: standardTable.jobs,
    timestamps: true,
    columns: jobsTableColumns,
    dependsOn: [
      standardTable.org,
      standardTable.user,
      standardTable.model,
      standardTable.render,
    ],
  }),
  new FactorDbTable({
    tableKey: standardTable.collection,
    timestamps: true,
    columns: collectionTableColumns,
  }),
  new FactorDbTable({
    tableKey: standardTable.collectionMedia,
    timestamps: true,
    columns: collectionMediaColumns,
  }),
  new FactorDbTable({
    tableKey: standardTable.likes,
    timestamps: true,
    columns: mediaLikeColumns,
  }),
  new FactorDbTable({
    tableKey: standardTable.comments,
    timestamps: true,
    columns: commentColumns,
  }),
  new FactorDbTable({
    tableKey: standardTable.followers,
    timestamps: true,
    columns: followingColumns,
  }),
]

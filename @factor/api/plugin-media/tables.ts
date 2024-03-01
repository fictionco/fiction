import { FactorDbCol, FactorDbTable } from '../plugin-db'
import type { CreateObjectType } from '../tbl'

export type TableMediaConfig = Partial<CreateObjectType<typeof columns>>

const columns = [
  new FactorDbCol({
    key: 'mediaId',
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`object_id('media')`))
    },
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'userId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 40)
        .references(`factor_user.user_id`)
        .onUpdate('CASCADE')
    },
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'orgId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 50)
        .references(`factor_org.org_id`)
        .onUpdate('CASCADE')
        .notNullable()
    },
    default: () => '' as string,
  }),
  new FactorDbCol({
    key: 'hash',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'url',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'originUrl',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'thumbUrl',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'thumbOriginUrl',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'thumbFilePath',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),

  new FactorDbCol({
    key: 'blurhash',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'preview',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'filePath',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'mime',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'width',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    default: () => 0 as number,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'height',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    default: () => 0 as number,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'orientation',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    default: () => 0 as number,
    isSetting: true,
  }),

  new FactorDbCol({
    key: 'alt',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),

  new FactorDbCol({
    key: 'contentEncoding',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'etag',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'bucket',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'size',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    default: () => 0 as number,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'prompt',
    create: ({ schema, column }) => schema.text(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FactorDbCol({
    key: 'sourceImageUrl',
    create: ({ schema, column }) => schema.text(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),

] as const

export const mediaTable = new FactorDbTable({ tableKey: 'factor_media', timestamps: true, columns })

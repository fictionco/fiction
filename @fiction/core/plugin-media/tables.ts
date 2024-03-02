import { FictionDbCol, FictionDbTable } from '../plugin-db'
import type { CreateObjectType } from '../tbl'

export type TableMediaConfig = Partial<CreateObjectType<typeof columns>>

const columns = [
  new FictionDbCol({
    key: 'mediaId',
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`object_id('media')`))
    },
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'userId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 40)
        .references(`fiction_user.user_id`)
        .onUpdate('CASCADE')
    },
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'orgId',
    create: ({ schema, column }) => {
      schema
        .string(column.pgKey, 50)
        .references(`fiction_org.org_id`)
        .onUpdate('CASCADE')
        .notNullable()
    },
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'hash',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'url',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'originUrl',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'thumbUrl',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'thumbOriginUrl',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'thumbFilePath',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),

  new FictionDbCol({
    key: 'blurhash',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'preview',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'filePath',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'mime',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'width',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    default: () => 0 as number,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'height',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    default: () => 0 as number,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'orientation',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    default: () => 0 as number,
    isSetting: true,
  }),

  new FictionDbCol({
    key: 'alt',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),

  new FictionDbCol({
    key: 'contentEncoding',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'etag',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'bucket',
    create: ({ schema, column }) => schema.string(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'size',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    default: () => 0 as number,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'prompt',
    create: ({ schema, column }) => schema.text(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),
  new FictionDbCol({
    key: 'sourceImageUrl',
    create: ({ schema, column }) => schema.text(column.pgKey),
    default: () => '' as string,
    isSetting: true,
  }),

] as const

export const mediaTable = new FictionDbTable({ tableKey: 'fiction_media', timestamps: true, columns })

import { type CreateObjectType, standardTable } from '@fiction/core'
import { FictionDbCol, FictionDbTable } from '@fiction/core/plugin-db'

export const t = {
  subscribe: 'fiction_subscribe',
  ...standardTable,
}

export type TableSubscribeConfig = CreateObjectType<typeof subscribeColumns>

const subscribeColumns = [
  new FictionDbCol({
    key: 'subscribeId',
    isComposite: true,
    create: ({ schema }) => schema.primary(['publication_id', 'email']),
    default: () => '' as string,
  }),
  new FictionDbCol({
    key: 'email',
    create: ({ schema, column }) => schema.string(column.pgKey, 50).notNullable().index(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'subscriberId',
    create: ({ schema, column }) => schema.string(column.pgKey, 32).references(`fiction_user.user_id`).onUpdate('CASCADE'),
    default: () => '',
  }),
  new FictionDbCol({
    key: 'publicationId',
    create: ({ schema, column }) => schema.string(column.pgKey, 50).references(`${t.org}.orgId`).onUpdate('CASCADE').notNullable().index(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'code',
    create: ({ schema, column }) => schema.string(column.pgKey, 50),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'isVerified',
    create: ({ schema, column }) => schema.boolean(column.pgKey).defaultTo(false),
    default: () => false as boolean,
    zodSchema: ({ z }) => z.boolean(),
  }),

  new FictionDbCol({
    key: 'level',
    create: ({ schema, column }) => schema.string(column.pgKey).defaultTo('standard'),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),

  new FictionDbCol({
    key: 'status',
    create: ({ schema, column }) => schema.string(column.pgKey, 50),
    default: () => '' as 'active' | 'pending',
    zodSchema: ({ z }) => z.string(),
  }),
] as const

export const tables = [
  new FictionDbTable({ tableKey: t.subscribe, timestamps: true, columns: subscribeColumns }),
]

import { type CreateObjectType, type SyndicateStatus, standardTable } from '@fiction/core'
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
    create: ({ schema }) => schema.primary(['org_id', 'user_id']),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'userId',
    create: ({ schema, column }) => schema.string(column.pgKey, 32).references(`fiction_user.user_id`).onUpdate('CASCADE').notNullable().index(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'orgId',
    create: ({ schema, column }) => schema.string(column.pgKey, 50).references(`${t.org}.orgId`).onUpdate('CASCADE').notNullable().index(),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'level',
    create: ({ schema, column }) => schema.string(column.pgKey).defaultTo('standard'),
    default: () => '' as string,
    zodSchema: ({ z }) => z.string(),
  }),
  new FictionDbCol({
    key: 'status',
    create: ({ schema, column }) => schema.string(column.pgKey, 50).defaultTo('active'),
    default: () => '' as SyndicateStatus,
    zodSchema: ({ z }) => z.string(),
  }),
] as const

export const tables = [
  new FictionDbTable({ tableKey: t.subscribe, timestamps: true, columns: subscribeColumns, onCreate: t => t.unique(['user_id', 'org_id']) }),
]

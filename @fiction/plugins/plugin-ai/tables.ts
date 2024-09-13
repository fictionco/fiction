import type { User } from '@fiction/core'
import type { ColType } from '@fiction/core/tbl'
import { Col, FictionDbTable } from '@fiction/core'
import { standardTable } from '@fiction/core/tbl'
import { z } from 'zod'

export type TableSourceConfig = ColType<typeof sourceTableColumns> & { author?: User }

export type SourceItemMetaData = {
  type?: 'url' | 'file' | 'text' | 'sitemap'
  key?: string
  name?: string
  url?: string
  length?: number
  orgId?: string
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

export const sourceTableColumns = [
  new Col({ key: 'sourceId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('so')`)) }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 32).references(`${standardTable.org}.org_id`).onUpdate('CASCADE') }),
  new Col({ key: 'userId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 32).references(`fiction_user.user_id`) }),
  new Col({ key: 'agentId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 32).references(`${standardTable.agent}.agent_id`).onUpdate('CASCADE') }),
  new Col({ key: 'sourceName', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'sourceContent', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.text(col.k) }),
  new Col({ key: 'sourceUrls', sec: 'setting', sch: () => z.array(z.object({ url: z.string(), length: z.number() })), make: ({ s, col }) => s.jsonb(col.k), prepare: ({ value }) => JSON.stringify(value) }),
  new Col({ key: 'description', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 10_000) }),
  new Col({ key: 'sourceType', sec: 'setting', sch: () => z.enum(['url', 'file', 'text', 'sitemap']), make: ({ s, col }) => s.string(col.k) }),
] as const

export const tables = [

  new FictionDbTable({ tableKey: standardTable.source, timestamps: true, cols: sourceTableColumns }),

]

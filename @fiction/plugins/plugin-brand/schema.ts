import type { ColType } from '@fiction/core'

import { Col, FictionDbTable, standardTable } from '@fiction/core'
import { t as postTableNames } from '@fiction/posts'
import { BrandGuideSchemaV3 } from './guideSchema'

export const t = {
  ...standardTable,
  ...postTableNames,
  brand: 'fiction_brand',
} as const

export type TableBrand = Partial<ColType<typeof brandTableColumns>>

export const brandTableColumns = [
  new Col({ key: 'brandId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('bnd')`)).index() }),
  new Col({ key: 'orgId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`${t.org}.orgId`).onUpdate('CASCADE').notNullable().index() }),
  new Col({ key: 'title', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'description', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k).defaultTo('') }),
  new Col({ key: 'guide', sch: () => BrandGuideSchemaV3, make: ({ s, col }) => s.jsonb(col.k).defaultTo({}) }),
  new Col({ key: 'isPrimary', sch: ({ z }) => z.boolean(), make: ({ s, col }) => s.boolean(col.k).defaultTo(false) }),
] as const

export const settingsKeys = brandTableColumns.filter(c => c.sec === 'setting').map(c => c.key)

export const brandTable = new FictionDbTable({ tableKey: t.brand, timestamps: true, cols: brandTableColumns })

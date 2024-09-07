import { Col, FictionDbTable } from '../plugin-db/index.js'
import { standardTable } from '../tbl.js'
import type { ColType } from '../tbl.js'

export const t = { ...standardTable, media: 'fiction_media' }

export type TableMediaConfig = Partial<ColType<typeof mediaColumns>> & { isCached?: boolean }

export const mediaColumns = [
  new Col({ key: 'mediaId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('img')`)).index() }),
  new Col({ key: 'userId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k, 40).references(`fiction_user.user_id`).onUpdate('CASCADE').index() }),
  new Col({ key: 'orgId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`fiction_org.org_id`).onUpdate('CASCADE').index() }),
  new Col({ key: 'caption', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'hash', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'url', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k, 1000) }),
  new Col({ key: 'originUrl', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k, 1000) }),
  new Col({ key: 'rasterUrl', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'thumbUrl', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'thumbOriginUrl', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'thumbFilePath', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'blurhash', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'preview', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'filePath', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'mime', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'width', sec: 'setting', sch: ({ z }) => z.number(), make: ({ s, col }) => s.integer(col.k) }),
  new Col({ key: 'height', sec: 'setting', sch: ({ z }) => z.number(), make: ({ s, col }) => s.integer(col.k) }),
  new Col({ key: 'orientation', sec: 'setting', sch: ({ z }) => z.number(), make: ({ s, col }) => s.integer(col.k) }),
  new Col({ key: 'duration', sec: 'setting', sch: ({ z }) => z.number(), make: ({ s, col }) => s.float(col.k) }),
  new Col({ key: 'alt', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'contentEncoding', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'etag', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'bucket', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'size', sec: 'setting', sch: ({ z }) => z.number(), make: ({ s, col }) => s.integer(col.k) }),
  new Col({ key: 'prompt', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col }) => s.text(col.k) }),
  new Col({ key: 'sourceImageUrl', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col }) => s.text(col.k) }),
] as const

export const mediaTable = new FictionDbTable({
  tableKey: t.media,
  timestamps: true,
  cols: mediaColumns,
  onCreate: t => t.unique(['org_id', 'hash']),
})

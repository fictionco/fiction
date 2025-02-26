import type { ColType } from '@fiction/core'
import { Col, FictionDbTable } from '@fiction/core/plugin-db'
import { z } from 'zod'

export const tableName = 'fiction_submission'

export type TableSubmissionConfig = ColType<typeof submissionColumns>
export const submissionColumns = [
  new Col({ key: 'submissionId', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('sbmt')`)) }),
  new Col({ key: 'userId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 32).references(`fiction_user.user_id`).onUpdate('CASCADE') }),
  new Col({ key: 'notificationEmail', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'appName', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'appUrl', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'name', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'email', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'orgName', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'orgUrl', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'orgTitle', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'message', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 2000) }),
  new Col({ key: 'phone', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'twitter', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'github', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'linkedIn', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
] as const

export const table = new FictionDbTable({
  tableKey: tableName,
  timestamps: true,
  cols: submissionColumns,
})

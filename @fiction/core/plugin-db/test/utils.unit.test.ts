import { describe, expect, it } from 'vitest'
import { createTestUtils } from '@fiction/core/test-utils'
import { t } from '@fiction/posts/schema.js'
import { Col, FictionDbTable } from '../objects.js'
import { dbPrep } from '../utils.js'

describe('dbPrep', () => {
  const testUtils = createTestUtils()
  const fictionDb = testUtils.fictionDb

  const cols = [
    new Col({ key: 'emailId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('eml')`)).index() }),
    new Col({ key: 'userId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.user}.user_id`).onUpdate('CASCADE').index() }),
    new Col({ key: 'orgId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`${t.org}.orgId`).onUpdate('CASCADE').notNullable().index() }),
    new Col({ key: 'postId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`${t.posts}.postId`).onUpdate('CASCADE').onDelete('CASCADE').notNullable().index() }),
    new Col({ key: 'code', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k), sec: 'authority' }),
    new Col({ key: 'title', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k), sec: 'setting' }),
    new Col({ key: 'sentAt', sch: ({ z }) => z.string(), make: ({ s, col }) => s.timestamp(col.k).defaultTo(null) }),
    new Col({ key: 'subject', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k) }),
    new Col({ key: 'preview', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k) }),
    new Col({ key: 'from', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k) }),
    new Col({ key: 'scheduleMode', sch: ({ z }) => z.enum(['now', 'schedule']), make: ({ s, col }) => s.string(col.k) }),
    new Col({ key: 'scheduledAt', sch: ({ z }) => z.string(), make: ({ s, col }) => s.timestamp(col.k).defaultTo(null) }),
    new Col({ key: 'draft', sch: ({ z }) => z.record(z.string(), z.any()), make: ({ s, col }) => s.jsonb(col.k).defaultTo({}) }),
  ] as const

  const tables = [new FictionDbTable({ tableKey: 'fiction_test_schema', timestamps: true, cols })]

  fictionDb.addTables(tables)

  it('should return fields if they are not an object', () => {
    const result = dbPrep({
      type: 'insert',
      fields: null,
      table: 'fiction_test_schema',
      fictionDb,
    })
    expect(result).toBeNull()

    const result2 = dbPrep({
      type: 'insert',
      fields: 'not an object' as any,
      table: 'fiction_test_schema',
      fictionDb,
    })
    expect(result2).toBe('not an object')
  })

  it('should validate and prepare fields correctly for insert type', () => {
    const fields = {
      emailId: 'test@example.com',
      userId: 'user123',
      title: 'Test Title',
      createdAt: new Date().toISOString(),
    }
    const result = dbPrep({
      type: 'insert',
      fields,
      table: 'fiction_test_schema',
      fictionDb,
    })
    expect(result).toStrictEqual(expect.objectContaining({
      emailId: 'test@example.com',
      userId: 'user123',
      title: 'Test Title',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    }))
  })

  it('should validate and prepare fields correctly for update type', () => {
    const fields = {
      emailId: 'test@example.com',
      userId: 'user123',
      title: 'Updated Title',
      createdAt: new Date().toISOString(),
    }
    const result = dbPrep({
      type: 'update',
      fields,
      table: 'fiction_test_schema',
      meta: { bearer: { isSuperAdmin: true } },
      fictionDb,
    })

    expect(result.emailId).toBeFalsy()

    expect(result).toEqual(expect.objectContaining({
      title: 'Updated Title',
      updatedAt: expect.any(String), // Matching any string
    }))
  })

  it('should throw an error if validation fails', () => {
    const fields = {
      emailId: 12345, // Invalid type
      userId: 'user123',
    }
    expect(() => {
      dbPrep({
        type: 'insert',
        fields,
        table: 'fiction_test_schema',
        fictionDb,
      })
    }).toThrowError(/Validation failed for field emailId/)
  })

  it('should handle return type correctly', () => {
    const fields = {
      emailId: 'test@example.com',
      userId: 'user123',
      title: 'Active Title',
      code: '12345',
    }
    const result = dbPrep({
      type: 'return',
      fields,
      table: 'fiction_test_schema',
      meta: { returnAuthority: [] },
      fictionDb,
    })
    expect(result.code).toBeFalsy()
    expect(result).toEqual(expect.objectContaining({
      emailId: 'test@example.com',
      userId: 'user123',
      title: 'Active Title',
    }))

    const result2 = dbPrep({
      type: 'return',
      fields,
      table: 'fiction_test_schema',
      meta: { returnAuthority: ['code'] },
      fictionDb,
    })
    expect(result2).toEqual(expect.objectContaining({
      emailId: 'test@example.com',
      userId: 'user123',
      title: 'Active Title',
      code: '12345',
    }))
  })
})

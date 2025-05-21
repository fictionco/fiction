import type { Knex } from 'knex'

/**
 * Ensures a handle is unique by incrementing if it already exists
 */
export async function ensureUniqueHandle(args: {
  db: Knex
  table: string
  handle: string
  excludeId?: string
  idColumn: string
  maxAttempts?: number
}): Promise<string> {
  const {
    db,
    table,
    handle,
    excludeId,
    idColumn,
    maxAttempts = 20,
  } = args

  let currentHandle = handle
  let attempts = 0

  while (attempts < maxAttempts) {
    const query = db(table).where('handle', currentHandle)

    if (excludeId) {
      query.whereNot(idColumn, excludeId)
    }

    const existingRecord = await query.first()
    if (!existingRecord)
      return currentHandle

    // Increment handle
    const match = currentHandle.match(/^(.*?)(?:-(\d+))?$/)
    const base = match?.[1] || currentHandle
    const num = match?.[2] ? Number.parseInt(match[2]) + 1 : 1
    currentHandle = `${base}-${num}`

    attempts++
  }

  // Fallback if we hit max attempts
  return `${handle}-${Date.now().toString().slice(-6)}`
}

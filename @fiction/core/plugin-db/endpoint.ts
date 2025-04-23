import type { EndpointResponse, ResponseStatus, ValidationReason } from '../types'
import type { FictionDb } from './index.js'
import { Query } from '../query.js'
import { toSlug } from '../utils/casing.js'

type QuerySettings = { fictionDb: FictionDb }

type HandleResult = { available: ResponseStatus, reason: ValidationReason }

export type CheckColumnValue = {
  name: string
  value?: string
  minLength?: number
  allowReserved?: boolean // Allow fiction reserved words
  allowAnyValue?: boolean
}

type CheckHandleParams = { table: string, columns: CheckColumnValue[] }

export class CheckHandle extends Query<QuerySettings> {
  isUrlFriendly(handle: string): boolean {
    return /^[\w-]+$/.test(handle)
  }

  async getWords(): Promise<Set<string>> {
    const { words } = await import('../utils/lib/words.js')
    return new Set(words)
  }

  async run(
    params: CheckHandleParams,
  ): Promise<EndpointResponse<HandleResult>> {
    const wordsSet = await this.getWords()
    const { fictionDb } = this.settings
    const { table, columns } = params

    let result: HandleResult = { available: 'loading', reason: 'loading' }

    try {
      for (const col of columns) {
        const { value, minLength = 3, allowReserved = false, allowAnyValue = false } = col
        const prepped = allowAnyValue ? value?.trim() : toSlug(value?.trim())

        if (!prepped || prepped.length < minLength) {
          result = { available: 'fail', reason: 'short' }
          break
        }
        else if (!allowAnyValue && !this.isUrlFriendly(prepped)) {
          result = { available: 'fail', reason: 'invalid' }
          break
        }
        else if (!allowReserved && wordsSet.has(prepped)) {
          result = { available: 'fail', reason: 'reserved' }
          break
        }

        const r = await fictionDb.db?.table(table).where((builder) => {
          columns.forEach(({ name, value }) => {
            if (!value)
              return

            const v = allowAnyValue ? value.trim() : toSlug(value.trim())
            void builder.andWhere(name, v)
          })
        }).first()

        if (r) {
          result = { available: 'fail', reason: 'taken' }
          break
        }
      }

      if (result.available === 'loading') { // All checks passed
        result = { available: 'success', reason: 'success' }
      }

      return { status: 'success', data: result }
    }
    catch (error) {
      this.log.error('Error checking username', { error, data: params })
      result = { available: 'error', reason: 'error' }
      return { status: 'error', data: result }
    }
  }
}

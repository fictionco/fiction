import type { EndpointResponse, ResponseStatus, ValidationReason } from '@fiction/core'
import { Query } from '../query'
import type { FictionDb } from '.'

type QuerySettings = { fictionDb: FictionDb }

type UsernameResult = { available: ResponseStatus, reason: ValidationReason }

export class CheckUsername extends Query<QuerySettings> {
  isUrlFriendly(username: string): boolean {
    return /^[a-zA-Z0-9-_]+$/.test(username)
  }

  async getWords(): Promise<Set<string>> {
    const { words } = await import('../utils/lib/words')
    return new Set(words)
  }

  async run(
    params: { table: string, column: string, value: string },
  ): Promise<EndpointResponse<UsernameResult>> {
    const wordsSet = await this.getWords()
    const { fictionDb } = this.settings
    const { table, column, value } = params

    const prepped = value.trim().toLowerCase()

    let result: UsernameResult = { available: 'loading', reason: 'loading' }

    try {
      if (prepped.length <= 3) {
        result = { available: 'fail', reason: 'short' }
      }
      else if (!this.isUrlFriendly(prepped)) {
        result = { available: 'fail', reason: 'invalid' }
      }
      else if (wordsSet.has(prepped)) {
        result = { available: 'fail', reason: 'reserved' }
      }

      else {
        const r = await fictionDb.db?.table(table).select(column).where(column, prepped)

        if (r?.length)
          result = { available: 'fail', reason: 'taken' }

        else
          result = { available: 'success', reason: 'success' }
      }

      return { status: 'success', data: result }
    }
    catch (error) {
      this.log.error('error checking username', { error, data: { table, column, value } })
      result = { available: 'error', reason: `error` }
      return { status: 'error', data: result }
    }
  }
}

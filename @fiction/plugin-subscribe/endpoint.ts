import type {
  EndpointMeta,
  EndpointResponse,
  FactorDb,
  FactorEmail,
  FactorEnv,
} from '@fiction/core'
import {
  Query,
} from '@fiction/core'
import type { FactorMonitor } from '@fiction/plugin-monitor'
import type { TableSubmissionConfig } from './tables'
import { tableName } from './tables'
import type { FactorSubscribe } from '.'

interface SaveMediaSettings {
  factorSubscribe: FactorSubscribe
  factorDb?: FactorDb
  factorEnv: FactorEnv
  factorMonitor: FactorMonitor
  factorEmail: FactorEmail
}

abstract class SubscribeQuery extends Query<SaveMediaSettings> {
  factorSubscribe = this.settings.factorSubscribe
  factorDb = this.settings.factorDb
  factorEnv = this.settings.factorEnv
  factorMonitor = this.settings.factorMonitor
  factorEmail = this.settings.factorEmail
  constructor(settings: SaveMediaSettings) {
    super(settings)
  }
}

interface SubmissionParams {
  _action: 'init'
  email?: string
}

export class QueryManageSubscribe extends SubscribeQuery {
  async run(
    params: SubmissionParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<TableSubmissionConfig>> {
    if (!this.factorDb)
      throw this.stop('no factorDb')
    const { _action, email } = params

    const db = this.factorDb.client()

    let message = ''
    let resultSubmission: TableSubmissionConfig | undefined
    if (_action === 'init') {
      const prepped = this.utils.prepareFields({
        type: 'settings',
        fields: { email },
        table: tableName,
        meta,
        factorDb: this.factorDb,
      })

      ;[resultSubmission] = await db
        .insert(prepped)
        .into(tableName)
        .returning<TableSubmissionConfig[]>('*')

      message = 'submission saved'

      await this.factorMonitor.slackNotify({
        message: '*New Email Subscribe*',
        data: resultSubmission,
      })
    }

    return { status: 'success', data: resultSubmission, message }
  }
}

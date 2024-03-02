import type {
  EndpointMeta,
  EndpointResponse,
  FictionDb,
  FictionEmail,
  FictionEnv,
} from '@fiction/core'
import {
  Query,
} from '@fiction/core'
import type { FictionMonitor } from '@fiction/plugin-monitor'
import type { TableSubmissionConfig } from './tables'
import { tableName } from './tables'
import type { FictionSubscribe } from '.'

interface SaveMediaSettings {
  fictionSubscribe: FictionSubscribe
  fictionDb?: FictionDb
  fictionEnv: FictionEnv
  fictionMonitor: FictionMonitor
  fictionEmail: FictionEmail
}

abstract class SubscribeQuery extends Query<SaveMediaSettings> {
  fictionSubscribe = this.settings.fictionSubscribe
  fictionDb = this.settings.fictionDb
  fictionEnv = this.settings.fictionEnv
  fictionMonitor = this.settings.fictionMonitor
  fictionEmail = this.settings.fictionEmail
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
    if (!this.fictionDb)
      throw this.stop('no fictionDb')
    const { _action, email } = params

    const db = this.fictionDb.client()

    let message = ''
    let resultSubmission: TableSubmissionConfig | undefined
    if (_action === 'init') {
      const prepped = this.utils.prepareFields({
        type: 'settings',
        fields: { email },
        table: tableName,
        meta,
        fictionDb: this.fictionDb,
      })

      ;[resultSubmission] = await db
        .insert(prepped)
        .into(tableName)
        .returning<TableSubmissionConfig[]>('*')

      message = 'submission saved'

      await this.fictionMonitor.slackNotify({
        message: '*New Email Subscribe*',
        data: resultSubmission,
      })
    }

    return { status: 'success', data: resultSubmission, message }
  }
}

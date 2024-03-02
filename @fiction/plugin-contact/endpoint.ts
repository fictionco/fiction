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
import type { FactorContact } from '.'

interface SaveMediaSettings {
  factorContact: FactorContact
  factorDb?: FactorDb
  factorEnv: FactorEnv
  factorMonitor: FactorMonitor
  factorEmail: FactorEmail
}

abstract class ContactQuery extends Query<SaveMediaSettings> {
  factorContact = this.settings.factorContact
  factorDb = this.settings.factorDb
  factorEnv = this.settings.factorEnv
  factorMonitor = this.settings.factorMonitor
  factorEmail = this.settings.factorEmail
  maxSide = this.utils.isTest() ? 700 : 1600
  constructor(settings: SaveMediaSettings) {
    super(settings)
  }
}

interface SubmissionParams {
  _action: 'create'
  submission: Partial<TableSubmissionConfig>
}

export class QueryManageSubmission extends ContactQuery {
  async run(
    params: SubmissionParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<TableSubmissionConfig>> {
    if (!this.factorDb)
      throw this.stop('no factorDb')
    const { _action, submission } = params

    const db = this.factorDb.client()

    let message = ''
    let resultSubmission: TableSubmissionConfig | undefined
    if (_action === 'create') {
      const prepped = this.utils.prepareFields({
        type: 'settings',
        fields: submission,
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
        message: '*New Contact Form Submission*',
        data: resultSubmission,
      })
    }

    return { status: 'success', data: resultSubmission, message }
  }
}

import type { EndpointMeta, EndpointResponse, FictionDb, FictionEmail, FictionEnv } from '@fiction/core'
import { Query, prepareFields, shortId } from '@fiction/core'
import type { FictionMonitor } from '@fiction/plugin-monitor'
import type { TableSubscribeConfig } from './schema'
import { t } from './schema'
import type { FictionSubscribe } from '.'

interface SaveMediaSettings {
  fictionSubscribe: FictionSubscribe
  fictionDb: FictionDb
  fictionEnv: FictionEnv
  fictionMonitor: FictionMonitor
  fictionEmail: FictionEmail
}

abstract class SubscribeQuery extends Query<SaveMediaSettings> {
  db = () => this.settings.fictionDb.client()
  constructor(settings: SaveMediaSettings) {
    super(settings)
  }
}

export type ManageSubscriptionParamsRequest =
  | {
    _action: 'create'
    email: string
    publicationId: string
  }
  | {
    _action: 'confirm'
    code: string
  }
  | {
    _action: 'list'
    publicationId: string
    limit?: number
    offset?: number
  }
  | {
    _action: 'count'
    publicationId: string
  }
  | {
    _action: 'update'
    subscriptionId: string
    updates: Partial<TableSubscribeConfig>
  }
  | {
    _action: 'delete'
    subscriptionId: string
  }

export type ManageSubscriptionResponse = EndpointResponse<TableSubscribeConfig[]>

export class ManageSubscriptionQuery extends SubscribeQuery {
  async run(params: ManageSubscriptionParamsRequest): Promise<ManageSubscriptionResponse> {
    switch (params._action) {
      case 'create':
        return this.createSubscription(params)
      case 'confirm':
        return this.confirmSubscription(params)
      case 'list':
        return this.listSubscriptions(params)
      case 'update':
        return this.updateSubscription(params)
      case 'delete':
        return this.deleteSubscription(params)
      default:
        return { status: 'error', message: 'Invalid action' }
    }
  }

  private async createSubscription(params: { email: string, publicationId: string }): Promise<ManageSubscriptionResponse> {
    const code = shortId({ len: 6 })
    const { publicationId, email } = params
    const insertData = { publicationId, email, code }
    const result = await this.db().table(t.subscribe).insert(insertData).onConflict('email').merge().returning('*')
    // sendVerificationEmail(params.email, code) // Assume a function to send email
    return { status: 'success', data: result }
  }

  private async confirmSubscription(params: { code: string }): Promise<ManageSubscriptionResponse> {
    const result = await this.db()
      .table(t.subscribe)
      .where({ code: params.code })
      .update({ status: 'confirmed' })
      .returning('*')
    return { status: 'success', data: result }
  }

  private async listSubscriptions(params: { publicationId: string, limit?: number, offset?: number }): Promise<ManageSubscriptionResponse> {
    const subscriptions = await this.db().select('*')
      .from(t.subscribe)
      .where({ orgId: params.publicationId })
      .limit(params.limit || 20)
      .offset(params.offset || 0)
    return { status: 'success', data: subscriptions }
  }

  private async updateSubscription(params: { subscriptionId: string, updates: Partial<TableSubscribeConfig> }): Promise<ManageSubscriptionResponse> {
    const result = await this.db().table(t.subscribe)
      .where({ subscribeId: params.subscriptionId })
      .update(params.updates)
      .returning('*')
    return { status: 'success', data: result }
  }

  private async deleteSubscription(params: { subscriptionId: string }): Promise<ManageSubscriptionResponse> {
    await this.db().table(t.subscribe)
      .where({ subscribeId: params.subscriptionId })
      .delete()
    return { status: 'success', message: 'Subscription deleted' }
  }
}

// interface SubmissionParams {
//   _action: 'init'
//   email?: string
// }

// export class QueryManageSubscribe extends SubscribeQuery {
//   async run(
//     params: SubmissionParams,
//     meta: EndpointMeta,
//   ): Promise<EndpointResponse<TableSubscribeConfig>> {
//     if (!this.fictionDb)
//       throw this.stop('no fictionDb')
//     const { _action, email } = params

//     const db = this.fictionDb.client()

//     let message = ''
//     let resultSubmission: TableSubscribeConfig | undefined
//     if (_action === 'init') {
//       const prepped = prepareFields({
//         type: 'settings',
//         fields: { email },
//         table: t.subscribe,
//         meta,
//         fictionDb: this.fictionDb,
//       })

//       ;[resultSubmission] = await db
//         .insert(prepped)
//         .into(t.subscribe)
//         .returning<TableSubscribeConfig[]>('*')

//       message = 'submission saved'

//       await this.fictionMonitor.slackNotify({
//         message: '*New Email Subscribe*',
//         data: resultSubmission,
//       })
//     }

//     return { status: 'success', data: resultSubmission, message }
//   }
// }

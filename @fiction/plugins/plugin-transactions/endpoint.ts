import type { EndpointMeta, EndpointResponse, FictionDb, FictionEmail, FictionEnv, FictionUser, User } from '@fiction/core'
import { Query, abort } from '@fiction/core'
import type { FictionMonitor } from '@fiction/plugin-monitor'
import type { EmailResponse } from '@fiction/core/plugin-email/endpoint'
import type { EmailAction, FictionTransactions, SendArgsRequest } from '.'

interface EmailActionQuerySettings {
  fictionTransactions: FictionTransactions
  fictionDb: FictionDb
  fictionEnv: FictionEnv
  fictionMonitor?: FictionMonitor
  fictionEmail: FictionEmail
  fictionUser: FictionUser
}

abstract class EmailActionQuery extends Query<EmailActionQuerySettings> {
  db = () => this.settings.fictionDb.client()
  constructor(settings: EmailActionQuerySettings) {
    super(settings)
  }
}

export type EmailActionParams =
  { actionId: string } & (
    ({ _action: 'serverTransaction' } & Record<string, unknown>) |
    ({ _action: 'sendEmail' } & SendArgsRequest & { queryVars?: Record<string, string> })
  )

export class EndpointEmailAction extends EmailActionQuery {
  async run(params: EmailActionParams, meta: EndpointMeta): Promise<EndpointResponse> {
    const { actionId, _action } = params

    const fictionTransactions = this.settings.fictionTransactions
    const transaction = fictionTransactions.emailActions[actionId]

    if (!transaction)
      throw abort(`invalid email action (${actionId})`, { expose: true, data: { available: Object.keys(fictionTransactions.emailActions) } })

    let r: EndpointResponse | undefined

    switch (_action) {
      case 'serverTransaction':{
        const args = { ...params, transaction }
        r = await transaction.settings.serverTransaction?.(args, meta)
        break
      } case 'sendEmail':
        r = await this.sendEmail(transaction, params, meta)
        break
      default:
        throw abort(`_action ${_action as string} not valid`, { expose: true })
    }

    return r || { status: 'error', message: 'Nothing returned', expose: false }
  }

  async sendEmail(emailAction: EmailAction, params: EmailActionParams & { _action: 'sendEmail' }, meta: EndpointMeta): Promise<EndpointResponse<{ recipient: User }>> {
    const { to, fields } = params

    const fictionUser = this.settings.fictionUser
    const userResponse = await fictionUser.queries.ManageUser.serve({ _action: 'getCreate', email: to, fields }, { ...meta, returnAuthority: ['verify'] })

    const user = userResponse.data
    const isNew = userResponse.isNew

    if (!user)
      throw abort('user not found or created', { expose: false })

    const queryVars = params.queryVars || {}

    await emailAction.serveSend({ recipient: user, isNew, queryVars, ...params }, meta)

    return { status: 'success', data: { recipient: user }, expose: false }
  }
}

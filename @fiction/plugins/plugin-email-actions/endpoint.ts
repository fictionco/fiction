import type { EndpointMeta, EndpointResponse, FictionDb, FictionEmail, FictionEnv, FictionUser } from '@fiction/core'
import { Query, abort } from '@fiction/core'
import type { FictionMonitor } from '@fiction/plugin-monitor'
import type { EmailResponse } from '@fiction/core/plugin-email/endpoint'
import type { EmailAction, FictionEmailActions, SendArgsRequest } from '.'

interface EmailActionQuerySettings {
  fictionEmailActions: FictionEmailActions
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

    const fictionEmailActions = this.settings.fictionEmailActions
    const action = fictionEmailActions.emailActions[actionId]

    if (!action)
      throw abort('invalid action', { expose: true })

    let r: EndpointResponse | undefined

    switch (_action) {
      case 'serverTransaction':
        r = await action.settings.serverTransaction?.(action, params, meta)
        break
      case 'sendEmail':
        r = await this.sendEmail(action, params, meta)
        break
      default:
        throw abort('invalid action', { expose: true })
    }

    return r || { status: 'error', message: 'Nothing returned', expose: false }
  }

  async sendEmail(emailAction: EmailAction, params: EmailActionParams & { _action: 'sendEmail' }, meta: EndpointMeta): Promise<EndpointResponse<{ isSent: boolean }>> {
    const { to, fields } = params

    const fictionUser = this.settings.fictionUser
    const userResponse = await fictionUser.queries.ManageUser.serve({ _action: 'getCreate', email: to, fields }, meta)

    const user = userResponse.data
    const isNew = userResponse.isNew

    if (!user)
      throw abort('user not found or created', { expose: false })

    await emailAction.serveSend({ recipient: user, isNew, ...params }, meta)

    return { status: 'success', data: { isSent: true }, expose: false }
  }
}

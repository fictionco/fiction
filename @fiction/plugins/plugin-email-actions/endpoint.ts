import type { EndpointMeta, EndpointResponse, FictionDb, FictionEmail, FictionEnv } from '@fiction/core'
import { Query, prepareFields, shortId } from '@fiction/core'
import type { FictionMonitor } from '@fiction/plugin-monitor'
import type { FictionEmailActions } from '.'

interface EmailActionQuerySettings {
  fictionEmailActions: FictionEmailActions
  fictionDb: FictionDb
  fictionEnv: FictionEnv
  fictionMonitor?: FictionMonitor
  fictionEmail: FictionEmail
}

abstract class EmailActionQuery extends Query<EmailActionQuerySettings> {
  db = () => this.settings.fictionDb.client()
  constructor(settings: EmailActionQuerySettings) {
    super(settings)
  }
}

export type EmailActionParams = { actionId: string } & Record<string, unknown>

export class EndpointEmailAction extends EmailActionQuery {
  async run(params: EmailActionParams, meta: EndpointMeta): Promise<EndpointResponse> {
    const fictionEmailActions = this.settings.fictionEmailActions
    const action = fictionEmailActions.emailActions[params.actionId]

    if (!action)
      return { status: 'error', message: 'Invalid action' }

    const r = await action.settings.serverAction?.(action, params, meta)

    return r || { status: 'error', message: 'Nothing returned', expose: false }
  }
}

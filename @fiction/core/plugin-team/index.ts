import type { FictionApp } from '../plugin-app/index.js'
import type { FictionDb } from '../plugin-db/index.js'
import type { FictionEmail } from '../plugin-email/index.js'
import type { FictionRouter } from '../plugin-router/index.js'
import type { FictionServer } from '../plugin-server/index.js'
import type { FictionUser } from '../plugin-user/index.js'
import type { FictionPluginSettings } from '../plugin.js'
import { FictionPlugin } from '../plugin.js'
import { safeDirname } from '../utils/index.js'
import { QueryOrgMembers, QueryTeamInvite } from './endpoint.js'

export type FictionTeamSettings = {
  fictionApp: FictionApp
  fictionDb: FictionDb
  fictionUser: FictionUser
  fictionServer: FictionServer
  fictionEmail: FictionEmail
  fictionRouter: FictionRouter
} & FictionPluginSettings

export class FictionTeam extends FictionPlugin<FictionTeamSettings> {
  queries = {
    OrgMembers: new QueryOrgMembers({ ...this.settings, fictionTeam: this }),
    TeamInvite: new QueryTeamInvite({ ...this.settings, fictionTeam: this }),
  }

  requests = this.createRequests({
    queries: this.queries,
    fictionServer: this.settings.fictionServer,
    fictionUser: this.settings.fictionUser,
  })

  constructor(settings: FictionTeamSettings) {
    super('fictionTeam', { root: safeDirname(import.meta.url), ...settings })
  }

  async loadMemberIndex() {
    const requestPromise = this.requests.OrgMembers.projectRequest({ _action: 'list' })

    const r = await requestPromise

    return r.data
  }

  async loadMember(memberId: string) {
    const r = await this.requests.OrgMembers.projectRequest({ _action: 'single', memberId })

    return r.data?.[0]
  }
}

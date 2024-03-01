import type { FactorPluginSettings } from '../plugin'
import { FactorPlugin } from '../plugin'
import type { FactorUser, Organization, User } from '../plugin-user'
import type { FactorServer } from '../plugin-server'
import type { FactorEmail } from '../plugin-email'
import type { FactorRouter } from '../plugin-router'
import type { FactorDb } from '../plugin-db'
import type { FactorApp } from '../plugin-app'
import {
  QueryOrgMembers,
  QuerySeekInviteFromUser,
  QueryTeamInvite,
} from './query'

type FactorTeamSettings = {
  factorApp: FactorApp
  factorDb: FactorDb
  factorUser: FactorUser
  factorServer: FactorServer
  factorEmail: FactorEmail
  factorRouter: FactorRouter
} & FactorPluginSettings

export class FactorTeam extends FactorPlugin<FactorTeamSettings> {
  queries = {
    OrgMembers: new QueryOrgMembers({ ...this.settings, factorTeam: this }),
    TeamInvite: new QueryTeamInvite({ ...this.settings, factorTeam: this }),
    SeekInviteFromUser: new QuerySeekInviteFromUser({ ...this.settings, factorTeam: this }),
  }

  requests = this.createRequests({
    queries: this.queries,
    factorServer: this.settings.factorServer,
    factorUser: this.settings.factorUser,
  })

  root = this.utils.safeDirname(import.meta.url)
  constructor(settings: FactorTeamSettings) {
    super('factorTeam', settings)

    this.factorEnv?.uiPaths.push(`${this.root}/**/*.vue`)
  }

  invitationReturnUrl(args: {
    code: string
    email: string
    orgId: string
    redirect: string
  }): string {
    const { email, code, orgId, redirect = '' } = args
    const url = this.settings.factorEnv.appUrl
    const e = encodeURIComponent(email)
    const r = encodeURIComponent(redirect)
    return `${url}/set-password?code=${code}&flow=invited&orgId=${orgId}&email=${e}&redirect=${r}`
  }

  async loadMemberIndex() {
    const requestPromise = this.requests.OrgMembers.projectRequest({
      _action: 'index',
    })

    const r = await requestPromise

    return r.data
  }

  async loadMember(userId: string) {
    const r = await this.requests.OrgMembers.projectRequest({
      _action: 'single',
      memberId: userId,
    })

    return r.data?.[0]
  }

  /**
   * Currently unused
   */
  async sendClientOrganizationWelcome(params: {
    client: User
    user: User
    org: Organization
  }): Promise<void> {
    const { client, user, org } = params
    const { email, verificationCode } = client
    const { fullName: requestingName = 'A user', email: requestingEmail } = user

    if (!email)
      throw new Error('no client email')

    const { orgName } = org

    const text = `Hi there!\n\n${requestingName} (${requestingEmail}) has invited you to the organization "${orgName}."`

    if (!verificationCode)
      throw this.stop('A verification code is required')

    await this.settings.factorEmail.sendEmail({
      subject: `${org.orgName}: You've been invited!`,
      text,
      linkText: 'Set Your Password',
      linkUrl: this.invitationReturnUrl({
        code: verificationCode,
        email,
        orgId: org.orgId,
        redirect: `/org/${org.orgId}`,
      }),
      to: email,
    })
  }
}

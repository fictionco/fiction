import type {
  FactorApp,
  FactorDb,
  FactorEmail,
  FactorPluginSettings,
  FactorRouter,
  FactorServer,
  FactorUser,
  Organization,
  User,
} from '@factor/api'
import {
  FactorPlugin,
} from '@factor/api'
import routes from './routes'
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
  factorApp = this.settings.factorApp
  factorDb = this.settings.factorDb
  factorUser = this.settings.factorUser
  factorServer = this.settings.factorServer
  factorRouter = this.settings.factorRouter
  factorEmail = this.settings.factorEmail
  queries = this.createQueries()
  requests = this.createRequests({
    queries: this.queries,
    factorServer: this.factorServer,
    factorUser: this.factorUser,
  })

  root = this.utils.safeDirname(import.meta.url)
  constructor(settings: FactorTeamSettings) {
    super('factorTeam', settings)

    this.factorEnv?.addUiPaths([`${this.root}/**/*.vue`])

    this.factorRouter?.update(routes)
  }

  createQueries() {
    const deps = { ...this.settings, factorTeam: this }
    return {
      OrgMembers: new QueryOrgMembers(deps),
      TeamInvite: new QueryTeamInvite(deps),
      SeekInviteFromUser: new QuerySeekInviteFromUser(deps),
    } as const
  }

  invitationReturnUrl(args: {
    code: string
    email: string
    organizationId: string
    redirect: string
  }): string {
    const { email, code, organizationId, redirect = '' } = args
    const url = this.factorEmail.appUrl.value
    const e = encodeURIComponent(email)
    const r = encodeURIComponent(redirect)
    return `${url}/set-password?code=${code}&flow=invited&organizationId=${organizationId}&email=${e}&redirect=${r}`
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

    const { organizationName } = org

    const text = `Hi there!\n\n${requestingName} (${requestingEmail}) has invited you to the organization "${organizationName}."`

    if (!verificationCode)
      throw this.stop({ message: 'A verification code is required' })

    await this.factorEmail.sendEmail({
      subject: `${org.organizationName}: You've been invited!`,
      text,
      linkText: 'Set Your Password',
      linkUrl: this.invitationReturnUrl({
        code: verificationCode,
        email,
        organizationId: org.organizationId,
        redirect: `/org/${org.organizationId}`,
      }),
      to: email,
    })
  }
}

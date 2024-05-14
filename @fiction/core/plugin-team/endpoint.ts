import { Query } from '../query'
import type { FictionDb } from '../plugin-db'
import type { FictionRouter } from '../plugin-router'
import type { FictionUser, MemberAccess, OrganizationMember, User } from '../plugin-user'
import type { EndpointMeta } from '../utils/endpoint'
import type { EndpointResponse } from '../types'
import type { FictionEmail } from '../plugin-email'
import type { FictionEnv } from '../plugin-env'
import { standardTable as t } from '../tbl'
import type { FictionTeam } from '.'

export interface TeamQuerySettings {
  fictionEnv: FictionEnv
  fictionTeam: FictionTeam
  fictionUser: FictionUser
  fictionDb: FictionDb
  fictionEmail: FictionEmail
  fictionRouter: FictionRouter
}

export abstract class TeamQuery extends Query<TeamQuerySettings> {
  db = () => this.settings.fictionDb.client()
  constructor(settings: TeamQuerySettings) {
    super(settings)
  }
}

type OrgMemberParams = { orgId: string } & (
  | { _action: 'single', memberId: string }
  | { _action: 'index', limit?: number, offset?: number }
)

export class QueryOrgMembers extends TeamQuery {
  async run(
    params: OrgMemberParams,
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<OrganizationMember[]>> {
    const { orgId, _action } = params

    const db = this.db()
    const base = db
      .from(t.member)
      .join(t.org, `${t.member}.org_id`, '=', `${t.org}.org_id`)
      .join(t.user, `${t.user}.user_id`, '=', `${t.member}.user_id`)
      .where(`${t.member}.org_id`, orgId)

    let indexMeta
    let data: OrganizationMember[] = []

    const selector = [`${t.member}.*`, `${t.user}.full_name`, `${t.user}.email`, `${t.user}.last_seen_at`]
    if (_action === 'single') {
      const r = await base
        .clone()
        .select<OrganizationMember[]>(selector)
        .where(`${t.member}.user_id`, params.memberId)

      data = r
    }
    else if (_action === 'index') {
      const { limit = 50, offset = 0 } = params
      const r = await base
        .clone()
        .select<OrganizationMember[]>(selector)
        .limit(limit)
        .offset(offset)
        .orderBy(`${t.user}.lastSeenAt`, 'desc')

      const countRows = await base.clone().count<{ count: number }[]>()
      indexMeta = { offset, limit, count: +countRows[0].count }
      data = r
    }

    return { status: 'success', data, indexMeta }
  }
}

export class QuerySeekInviteFromUser extends TeamQuery {
  async run(
    params: {
      email: string
      requestingEmail: string
      requestingName?: string
    },
    meta: EndpointMeta,
  ): Promise<EndpointResponse<boolean>> {
    if (!this.settings.fictionUser)
      throw new Error('no user service')
    const { email, requestingEmail, requestingName } = params
    const { data: user } = await this.settings.fictionUser.queries.ManageUser.serve({ _action: 'getPublic', email }, meta)

    if (!user)
      throw this.stop('request invite error')

    const { fullName } = user

    const text = `Hi ${fullName}!\n\n${
      requestingName || 'A user'
    } (${requestingEmail}) has requested access to one of your organizations.`

    if (!this.settings.fictionEmail)
      throw new Error('no email service')

    const appUrl = this.settings.fictionEnv.meta.app?.url

    const path = this.settings.fictionRouter?.rawPath('teamInvite')

    await this.settings.fictionEmail.sendEmail({
      subject: `${requestingName || requestingEmail}: Request for Access`,
      text,
      linkText: 'Login and Invite',
      linkUrl: `${appUrl}${path}`,
      to: email,
    })
    return {
      status: 'success',
      message: 'Invite requested',
      more: `The user using '${email}' should get an email requesting they invite you`,
    }
  }
}

export class QueryTeamInvite extends TeamQuery {
  async run(
    params: {
      orgId: string
      invites: { email: string, memberAccess: MemberAccess }[]
    },
    meta: EndpointMeta,
  ): Promise<EndpointResponse<boolean>> {
    if (!this.settings.fictionUser)
      throw new Error('no user service')
    if (!this.settings.fictionEmail)
      throw new Error('no email service')

    const appUrl = this.settings.fictionEnv.meta.app?.url

    if (!appUrl)
      throw new Error('no appUrl')

    const { orgId, invites } = params

    const { bearer } = meta

    if (!invites || invites.length === 0)
      throw this.stop('no invites were set')

    const { data: org }
      = await this.settings.fictionUser.queries.FindOneOrganization.serve({ orgId }, meta)

    if (!org)
      throw this.stop(`couldn't find organization`)

    const invitedById = bearer?.userId

    const _promises = invites.map(async (invite) => {
      if (!this.settings.fictionUser)
        throw new Error('no user service')
      const { memberAccess } = invite
      const email = invite.email.toLowerCase() // ensure lowercase

      const url = appUrl
      const redirect = encodeURIComponent(`/org/${orgId}`)
      let linkUrl = `${url}/login?ref=email&source=invite&redirect=${redirect}`
      let linkText = 'Login'
      let message = `Login to get access.`
      // does the user already exist
      let { data: user } = await this.settings.fictionUser.queries.ManageUser.serve(
        { _action: 'getPrivate', email },
        { server: true, returnAuthority: ['hashedPassword'] },
      )
      if (!user?.hashedPassword) {
        const { data: newUser }
          = await this.settings.fictionUser.queries.ManageUser.serve(
            { _action: 'create', fields: { invitedById, email } },
            { server: true, returnAuthority: ['verificationCode'] },
          )

        linkUrl = this.settings.fictionTeam.invitationReturnUrl({
          code: newUser?.verificationCode as string,
          email,
          orgId,
          redirect,
        })
        user = newUser
        message = `Click the link below to get access.`
        linkText = 'Get Access'
      }

      if (!user?.userId)
        throw this.stop('error creating user')

      await this.settings.fictionUser.queries.ManageMemberRelation.serve(
        {
          memberId: user.userId,
          orgId,
          memberAccess,
          _action: 'create',
          invitedById,
        },
        meta,
      )

      const text = `Hello!\n\nGood news. ${bearer?.fullName || 'A user'} (${
        bearer?.email || 'unknown'
      }) has added you as an ${memberAccess} to the "${
        org.orgName
      }" organization.\n\n${message}`

      await this.settings.fictionEmail?.sendEmail({
        subject: `${org.orgName}: You've been invited!`,
        text,
        linkText,
        linkUrl,
        to: email,
      })
    })

    await Promise.all(_promises)

    let user: User | undefined
    if (bearer?.userId) {
      const r = await this.settings.fictionUser.queries.ManageUser.serve(
        { _action: 'getPrivate', userId: bearer.userId },
        meta,
      )

      user = r.data
    }

    return { status: 'success', message: 'Invites sent', more: `New members were added.`, user }
  }
}
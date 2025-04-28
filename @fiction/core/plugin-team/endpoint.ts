import type { EmailSendConfig } from '../plugin-email/index.js'
import type { MemberAccess, OrganizationMember, User } from '../plugin-user/index.js'
import type { ComplexDataFilter, EndpointResponse } from '../types/index.js'
import type { EndpointMeta } from '../utils/endpoint.js'
import type { FictionTeam, FictionTeamSettings } from './index.js'
import { Query } from '../query.js'
import { standardTable as t } from '../tbl.js'
import { applyComplexFilters } from '../utils/db.js'
import { abort } from '../utils/error.js'
import { getOrgAvatar } from '../utils/url.js'

export type TeamQuerySettings = FictionTeamSettings & { fictionTeam: FictionTeam }
export abstract class TeamQuery extends Query<TeamQuerySettings> {
  db = () => this.settings.fictionDb.client()
  constructor(settings: TeamQuerySettings) {
    super(settings)
  }
}

type OrgMemberParams = { orgId: string } & (
  | { _action: 'single', memberId: string }
  | { _action: 'list', limit?: number, offset?: number, filters?: ComplexDataFilter[] }
)

export class QueryOrgMembers extends TeamQuery {
  async run(
    params: OrgMemberParams,
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<OrganizationMember[]>> {
    const { orgId, _action } = params

    const db = this.db()
    let query = db
      .from(t.member)
      .join(t.org, `${t.member}.org_id`, '=', `${t.org}.org_id`)
      .join(t.user, `${t.user}.user_id`, '=', `${t.member}.user_id`)
      .where(`${t.member}.org_id`, orgId)

    let indexMeta
    let data: OrganizationMember[] = []

    const selector = [`${t.member}.*`, `${t.user}.full_name`, `${t.user}.email`, `${t.user}.last_seen_at`]
    if (_action === 'single') {
      const r = await query
        .clone()
        .select<OrganizationMember[]>(selector)
        .where(`${t.member}.user_id`, params.memberId)

      data = r
    }
    else if (_action === 'list') {
      const { limit = 50, offset = 0, filters = [] } = params
      query = applyComplexFilters(query, filters)
      const r = await query
        .clone()
        .select<OrganizationMember[]>(selector)
        .limit(limit)
        .offset(offset)
        .orderBy(`${t.user}.lastSeenAt`, 'desc')

      const countRows = await query.clone().count<{ count: number }[]>()
      indexMeta = { offset, limit, count: +countRows[0].count }
      data = r
    }

    return { status: 'success', data, indexMeta }
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
    const { fictionUser, fictionEmail, fictionEnv } = this.settings

    if (!fictionUser || !fictionEmail)
      throw abort('User or email service unavailable')

    const appUrl = fictionEnv.meta?.url
    if (!appUrl)
      throw abort('Application URL not configured')

    const { orgId, invites } = params
    const { bearer } = meta

    if (!invites?.length)
      throw abort('No invitations specified')

    // Fetch organization details
    const { data: org } = await fictionUser.queries.ManageOrganization.serve(
      { _action: 'read', where: { orgId } },
      meta,
    )

    if (!org)
      throw abort('Organization not found')

    const inviterName = bearer?.fullName || 'Someone'
    const invitedById = bearer?.userId

    // Process each invitation
    const invitePromises = invites.map(async (invite) => {
      const { memberAccess } = invite
      const email = invite.email.toLowerCase().trim()

      // Use getCreate to simplify user creation/retrieval
      const { data: user, isNew } = await fictionUser.queries.ManageUser.serve(
        {
          _action: 'getCreate',
          where: { email },
          createUserFields: {
            invitedById,
            email,
            // Set the loadOrgId to the inviting org
            loadOrgId: orgId,
          },
        },
        { server: true, returnAuthority: ['verify'] },
      )

      if (!user?.userId)
        throw abort(`Failed to create or find user for ${email}`)

      const code = user.verify?.code

      // Add user to organization with specified access level
      await fictionUser.queries.ManageMemberRelation.serve({
        memberId: user.userId,
        orgId,
        memberAccess,
        _action: 'create',
        invitedById,
      }, meta)

      if (!code) {
        throw new Error('No code found')
      }

      // Determine appropriate access URL and label
      const accessUrl = this.invitationReturnUrl({ code, email, orgId, isNew })

      const accessLabel = isNew ? 'Accept Invitation' : 'Sign In to Access'

      const subject = `${inviterName} has invited you to "${org.orgName}"`
      const invitationText = `${inviterName} has invited you to join the **${org.orgName}** workspace on Fiction.\n\n`

      // Prepare complete email configuration
      const emailConfig: EmailSendConfig = {
        to: email,
        subject,
        title: isNew ? 'Welcome to Fiction' : 'Access Invitation',
        subTitle: isNew ? 'Create your account and join workspace' : 'Access this workspace',
        contentMarkdown: `${invitationText}`,
        buttons: [
          { label: accessLabel, href: accessUrl, theme: 'primary' },
        ],
        caller: 'teamInvite',
        fromOrgId: org.orgId,
        superTitle: {
          icon: getOrgAvatar(org),
          text: org.orgName,
          theme: 'primary',
        },
        companyName: 'Fiction.com',
        footerLinks: [
          { label: 'Visit Fiction.com', href: 'https://www.fiction.com' },
        ],
      }

      // Send invitation email
      await fictionEmail.renderAndSendEmail(emailConfig, { server: true })
    })

    await Promise.all(invitePromises)

    // Refresh user data if authenticated
    let user: User | undefined
    if (bearer?.userId) {
      const r = await fictionUser.queries.ManageUser.serve(
        { _action: 'retrieve', where: { userId: bearer.userId } },
        meta,
      )
      user = r.data
    }

    return {
      status: 'success',
      message: 'Invitations sent successfully',
      more: `Team members have been invited to ${org.orgName}.`,
      user,
    }
  }

  invitationReturnUrl(args: { code: string, email: string, orgId: string, redirect?: string, isNew?: boolean }): string {
    const { email, code, orgId, redirect, isNew = false } = args
    const url = this.settings.fictionEnv.meta?.url

    if (!url) {
      throw new Error('No app URL defined in environment meta settings')
    }

    const returnUserBase = `/app/auth`
    const newUserBase = `/app/auth/set-new-password`
    const pathname = isNew ? newUserBase : returnUserBase

    // Build query params, only including redirect if provided
    const queryParams = new URLSearchParams()
    queryParams.append('code', code)
    queryParams.append('orgId', orgId)
    queryParams.append('email', encodeURIComponent(email))

    if (redirect) {
      queryParams.append('redirect', encodeURIComponent(redirect))
    }

    // Construct the full URL without relying on path.join which is meant for file paths
    return `${url}${pathname}?${queryParams.toString()}`
  }
}

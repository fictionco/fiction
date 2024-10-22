import type { Knex } from 'knex'
import type { FictionDb } from '../plugin-db/index.js'
import type { FictionEmail } from '../plugin-email/index.js'
import type { FictionEnv } from '../plugin-env/index.js'
import type { EndpointResponse } from '../types/index.js'
import type { EndpointManageAction, EndpointMeta } from '../utils/endpoint.js'
import type { FictionUser, OrganizationMember } from './index.js'
import type { MemberAccess, MemberStatus, Organization, OrganizationMembership, User } from './types.js'
import { Query } from '../query.js'
import { standardTable as t } from '../tbl.js'
import { abort } from '../utils/error.js'
import { objectId } from '../utils/id.js'
import { gravatarUrlSync } from '../utils/url.js'

interface OrgQuerySettings {
  fictionUser: FictionUser
  fictionDb: FictionDb
  fictionEmail?: FictionEmail
  fictionEnv: FictionEnv
}
export abstract class OrgQuery extends Query<OrgQuerySettings> {
  db = () => this.settings.fictionDb.client()
  constructor(settings: OrgQuerySettings) {
    super(settings)
  }

  async returnUser(meta: EndpointMeta): Promise<User | undefined> {
    const userId = meta.bearer?.userId
    if (!userId)
      return

    let user: User | undefined
    if (userId) {
      const response = await this.settings.fictionUser.queries.ManageUser.serve({ _action: 'retrieve', where: { userId } }, meta)

      user = response.data
    }
    return user
  }
}

export abstract class QueryOrganization extends OrgQuery {
  memberObject(): string {
    const memberObject = [
      ['user_id', t.user],
      ['email', t.user],
      ['full_name', t.user],
      ['last_seen_at', t.user],
      ['avatar', t.user],
      ['member_access', t.member],
      ['member_status', t.member],
    ]
      .map(([key, table]) => `'${key}', ${table}.${key}`)
      .join(', ')

    return memberObject
  }

  orgBaseQuery(db: Knex): Knex.QueryBuilder {
    const subQueryMembers = db
      .select(
        db.raw(
          `json_agg(json_build_object(${this.memberObject()})) as members, max(member_count) as member_count`,
        ),
        `${t.org}.org_id`,
      )
      .from(t.org)
      .joinRaw(
        `left join lateral (
        select *, count(*) OVER() AS member_count
        from "fiction_org_user"
        where "fiction_org_user".org_id = "fiction_org"."org_id"
        limit 25
      ) as "fiction_org_user" on true`,
      )
      .join(t.user, `${t.user}.user_id`, `=`, `${t.member}.user_id`)
      .groupBy(`${t.org}.org_id`)
      .as('org_member')

    const q = db
      .select([`${t.org}.*`, `org_member.*`])
      .from(t.org)
      .leftJoin(subQueryMembers, `org_member.org_id`, `=`, `${t.org}.org_id`)

    return q
  }
}

export class QueryOrganizationsByUserId extends QueryOrganization {
  async run(params: { userId: string, lastOrgId?: string }, _meta: EndpointMeta): Promise<EndpointResponse<Organization[]>> {
    const { userId, lastOrgId } = params

    const db = this.db()
    const q = this.orgBaseQuery(db)
      .select(db.raw(`json_build_object(${this.memberObject()}) as relation`), `${t.org}.org_id`)
      .join(t.member, `${t.member}.org_id`, '=', `${t.org}.org_id`)
      .join(t.user, `${t.user}.user_id`, '=', `${t.member}.user_id`)
      .where<Organization[]>(`${t.member}.user_id`, userId)
      .orderBy(`${t.org}.updated_at`, 'desc')

    const r = await q

    const data = r
      .map((org: Organization) => this.refineRawOrganization({ org, lastOrgId, userId }, _meta))
      .filter(Boolean) as Organization[]

    return { status: 'success', data }
  }

  refineRawOrganization(
    params: { org: Organization, lastOrgId?: string, userId?: string },
    _meta: EndpointMeta,
  ): Organization | undefined {
    const { org, lastOrgId } = params
    if (!org)
      return

    // use development/test values for customer in development mode
    if (this.settings.fictionEnv?.isTest.value) {
      org.customer = org.customerTest
      org.customerId = org.customerIdTest
    }

    // remove nulls from empty joins
    org.members = (org.members ?? []).map((m: OrganizationMember) => {
      m.avatar = m.avatar || (m.email ? gravatarUrlSync(m.email, { size: 200 }) : undefined)

      return m
    })

    if (lastOrgId === org.orgId)
      org.lastOrgId = true

    return org
  }
}

export class QueryManageMemberRelation extends OrgQuery {
  async run(
    params: {
      _action: EndpointManageAction
      memberId: string
      orgId: string
      memberAccess?: MemberAccess
      memberStatus?: MemberStatus
      memberRole?: string
      invitedById?: string
      tags?: string[]
    },
    meta: EndpointMeta,
  ): Promise<EndpointResponse<OrganizationMembership>> {
    if (!this.settings.fictionUser)
      throw abort('no user service')
    if (!meta.bearer && !meta.server)
      throw abort('auth required')
    const { memberId, orgId, _action, memberAccess, memberStatus, memberRole, invitedById, tags } = params

    const db = this.db()

    let relation: OrganizationMembership | undefined
    let message = ''
    if (_action === 'delete') {
      ;[relation] = await db
        .delete()
        .from(t.member)
        .where({ userId: memberId, orgId })
        .limit(1)
        .returning<OrganizationMembership[]>('*')

      message = 'member removed'
    }
    else if (_action === 'create' || _action === 'update') {
      // Add relation
      ;[relation] = await db
        .insert({ userId: memberId, orgId, memberAccess, memberStatus, memberRole, invitedById, tags })
        .onConflict(['user_id', 'org_id'])
        .merge()
        .into(t.member)
        .returning<OrganizationMembership[]>('*')

      message = 'member updated'
    }

    const user = await this.returnUser(meta)

    return { status: 'success', data: relation, user, message }
  }
}

export type WhereOrg = { orgId: string } | { slug: string }

export type ManageOrganizationParams =
  | { _action: 'create', fields: Partial<Organization>, userId: string }
  | { _action: 'update', where: WhereOrg, fields: Partial<Organization> }
  | { _action: 'delete', where: WhereOrg }
  | { _action: 'retrieve', where: WhereOrg }
  | { _action: 'generateApiSecret', where: WhereOrg }

export class QueryManageOrganization extends OrgQuery {
  async run(params: ManageOrganizationParams, meta: EndpointMeta): Promise<EndpointResponse<Organization> & { user?: User }> {
    switch (params._action) {
      case 'create':
        return this.createOrganization(params, meta)
      case 'update':
        return this.updateOrganization(params, meta)
      case 'delete':
        return this.deleteOrganization(params, meta)
      case 'retrieve':
        return this.retrieveOrganization(params, meta)
      case 'generateApiSecret':
        return this.generateApiSecret(params, meta)
      default:
        throw abort('Invalid action')
    }
  }

  private async generateApiSecret(params: ManageOrganizationParams & { _action: 'generateApiSecret' }, meta: EndpointMeta): Promise<EndpointResponse<Organization> & { user?: User }> {
    const { where } = params

    this.validatePermission(where, meta)

    const { default: uuidAPIKey } = await import('uuid-apikey')

    const update: Record<string, any> = {
      apiSecret: uuidAPIKey.create().apiKey,
    }

    const [responseOrg] = await this.db()
      .table(t.org)
      .update(update)
      .where(where)
      .limit(1)
      .returning<Organization[]>('*')

    if (!responseOrg)
      throw abort('API secret generation failed')

    return this.prepareResponse(responseOrg, 'private API key created', meta)
  }

  private async createOrganization(params: ManageOrganizationParams & { _action: 'create' }, meta: EndpointMeta): Promise<EndpointResponse<Organization> & { user?: User }> {
    const { fields, userId } = params
    const { orgName, orgEmail, orgId } = fields
    const defaultName = orgEmail?.split('@')[0] || 'Personal'

    const [responseOrg] = await this.db()
      .insert({
        orgId: orgId || objectId({ prefix: 'org' }),
        orgName: orgName || defaultName,
        ownerId: fields.ownerId || userId,
        orgEmail,
      })
      .into(t.org)
      .onConflict('org_id')
      .ignore()
      .returning<Organization[]>('*')

    if (!responseOrg?.orgId)
      throw new Error('Organization creation failed')

    await this.manageMemberRelation({ userId, orgId: responseOrg.orgId, accessType: 'owner' }, meta)

    if (!responseOrg)
      throw new Error('Organization creation failed')

    return this.prepareResponse(responseOrg, 'Organization created', meta)
  }

  private async updateOrganization(params: ManageOrganizationParams & { _action: 'update' }, meta: EndpointMeta): Promise<EndpointResponse<Organization> & { user?: User }> {
    const { where, fields } = params
    this.validatePermission(where, meta)
    const updatedFields = this.settings.fictionDb.prep({
      type: meta.server ? 'internal' : 'update',
      fields,
      meta,
      table: t.org,
    })

    const [responseOrg] = await this.db()
      .update(updatedFields)
      .where(where)
      .into(t.org)
      .returning<Organization[]>('*')

    return this.prepareResponse(responseOrg, 'Organization updated', meta)
  }

  private async deleteOrganization(params: ManageOrganizationParams & { _action: 'delete' }, meta: EndpointMeta): Promise<EndpointResponse<Organization> & { user?: User }> {
    const { where } = params
    this.validatePermission(where, meta)
    const [responseOrg] = await this.db()
      .delete()
      .from(t.org)
      .where(where)
      .returning<Organization[]>('*')

    return this.prepareResponse(responseOrg, `Deleted organization: ${responseOrg.orgName}`, meta)
  }

  private async retrieveOrganization(params: ManageOrganizationParams & { _action: 'retrieve' }, meta: EndpointMeta): Promise<EndpointResponse<Organization> & { user?: User }> {
    const { where } = params
    const [responseOrg] = await this.db().select('*').from(t.org).where(where)

    return this.prepareResponse(responseOrg, 'Organization retrieved', meta)
  }

  // Additional helper functions for validation, member management, and response preparation
  private validatePermission(args: { orgId?: string, slug?: string }, meta: EndpointMeta) {
    if (meta.server)
      return

    if (meta.bearer?.orgs?.find(o => o.orgId === args.orgId || o.slug === args.slug))
      return

    throw abort('bearer privilege')
  }

  private async manageMemberRelation(args: { userId: string, orgId: string, accessType?: MemberAccess }, meta: EndpointMeta) {
    const { userId, orgId, accessType = 'owner' } = args
    return this.settings.fictionUser.queries.ManageMemberRelation.serve(
      {
        memberId: userId,
        orgId,
        memberAccess: accessType,
        memberStatus: 'active',
        _action: 'create',
      },
      meta,
    )
  }

  private async prepareResponse(org: Organization, message: string, meta: EndpointMeta): Promise<EndpointResponse<Organization> & { user?: User }> {
    const user = await this.returnUser(meta)

    return { status: 'success', message, user, data: org }
  }
}

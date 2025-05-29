import type { Knex } from 'knex'
import type { EndpointResponse } from '../types/index.js'
import type { EndpointMeta } from '../utils/endpoint.js'
import type { FictionUser, OrganizationMember, UserPluginSettings } from './index.js'
import type { MemberAccess, Organization, OrganizationMembership, User } from './types.js'
import { Query } from '../query.js'
import { standardTable as t } from '../tbl.js'
import { abort } from '../utils/error.js'
import { ensureUniqueHandle } from '../utils/handle.js'
import { objectId } from '../utils/id.js'
import { gravatarUrlSync } from '../utils/url.js'

type OrgQuerySettings = UserPluginSettings & {
  fictionUser: FictionUser
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
      const response = await this.settings.fictionUser.queries.ManageUser.serve({ _action: 'retrieve', where: { userId } }, { ...meta, server: true, caller: 'orgReturnUser' })

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
      ['created_at', t.member],
      ['updated_at', t.member],

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
  async run(params: { userId: string, loadOrgId?: string }, _meta: EndpointMeta): Promise<EndpointResponse<Organization[]>> {
    const { userId, loadOrgId } = params

    const db = this.db()
    const q = this.orgBaseQuery(db)
      .select(db.raw(`json_build_object(${this.memberObject()}) as relation`), `${t.org}.org_id`)
      .join(t.member, `${t.member}.org_id`, '=', `${t.org}.org_id`)
      .join(t.user, `${t.user}.user_id`, '=', `${t.member}.user_id`)
      .where<Organization[]>(`${t.member}.user_id`, userId)
      .orderBy(`${t.org}.updated_at`, 'desc')

    const r = await q

    const results = await Promise.all(r.map((org: Organization) => this.refineRawOrganization({ org, loadOrgId, userId })))

    const data = results.filter(Boolean) as Organization[]

    return { status: 'success', data }
  }

  async refineRawOrganization(
    params: { org: Organization, loadOrgId?: string, userId?: string },
  ): Promise<Organization | undefined> {
    const { org, loadOrgId } = params
    if (!org)
      return

    // use development/test values for customer in development mode
    if (this.settings.fictionEnv?.isTest.value) {
      org.customerId = org.customerIdTest
    }

    // remove nulls from empty joins
    org.members = (org.members ?? []).map((m: OrganizationMember) => {
      m.avatar = m.avatar || (m.email ? gravatarUrlSync(m.email, { size: 200 }) : undefined)

      return m
    })

    // this is the active organization for the user
    if (loadOrgId === org.orgId)
      org.loadOrgId = true

    return org
  }
}

export type WhereMember = { userId: string }

export type ManageMemberRelationParams =
  | { _action: 'create', orgId: string, fields: Partial<OrganizationMembership> }
  | { _action: 'update', orgId: string, where: WhereMember, fields: Partial<OrganizationMembership> }
  | { _action: 'delete', orgId: string, where: WhereMember }
  | { _action: 'list', orgId: string, limit?: number, offset?: number }

export class QueryManageMemberRelation extends OrgQuery {
  async run(
    params: ManageMemberRelationParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<OrganizationMembership[]>> {
    if (!this.settings.fictionUser)
      throw abort('no user service')
    if (!meta.bearer && !meta.server)
      throw abort('auth required')

    switch (params._action) {
      case 'create':
        return this.createMemberRelation(params, meta)
      case 'update':
        return this.updateMemberRelation(params, meta)
      case 'delete':
        return this.deleteMemberRelation(params, meta)
      case 'list':
        return this.listMemberRelations(params, meta)
      default:
        throw abort('Invalid action')
    }
  }

  private async createMemberRelation(params: ManageMemberRelationParams & { _action: 'create' }, meta: EndpointMeta): Promise<EndpointResponse<OrganizationMembership[]>> {
    const { orgId, fields } = params
    const db = this.db()

    const prepped = this.settings.fictionDb.prep({ type: meta.server ? 'internal' : 'insert', fields, meta, table: t.member })

    const [relation] = await db
      .insert({ orgId, ...prepped })
      .onConflict(['user_id', 'org_id'])
      .merge()
      .into(t.member)
      .returning<OrganizationMembership[]>('*')

    const user = await this.returnUser(meta)

    return { status: 'success', data: [relation], user, message: 'member added' }
  }

  private async updateMemberRelation(params: ManageMemberRelationParams & { _action: 'update' }, meta: EndpointMeta): Promise<EndpointResponse<OrganizationMembership[]>> {
    const { where, fields, orgId } = params
    const db = this.db()

    const updatedFields = this.settings.fictionDb.prep({ type: meta.server ? 'internal' : 'update', fields, meta, table: t.member })

    const [relation] = await db
      .update(updatedFields)
      .where({ userId: where.userId, orgId })
      .into(t.member)
      .returning<OrganizationMembership[]>('*')

    const user = await this.returnUser(meta)

    return { status: 'success', data: [relation], user, message: 'member updated' }
  }

  private async deleteMemberRelation(params: ManageMemberRelationParams & { _action: 'delete' }, meta: EndpointMeta): Promise<EndpointResponse<OrganizationMembership[]>> {
    const { where, orgId } = params
    const db = this.db()

    const [relation] = await db
      .delete()
      .from(t.member)
      .where({ userId: where.userId, orgId })
      .limit(1)
      .returning<OrganizationMembership[]>('*')

    const user = await this.returnUser(meta)

    return { status: 'success', data: [relation], user, message: 'member removed' }
  }

  private async listMemberRelations(params: ManageMemberRelationParams & { _action: 'list' }, meta: EndpointMeta): Promise<EndpointResponse<OrganizationMembership[]>> {
    const { orgId, limit = 100, offset = 0 } = params
    const db = this.db()

    // Join with user table to get member details
    const relations = await db
      .select([
        `${t.member}.*`,
        `${t.user}.email`,
        `${t.user}.full_name`,
        `${t.user}.avatar`,
      ])
      .from(t.member)
      .leftJoin(t.user, `${t.user}.user_id`, `${t.member}.user_id`)
      .where({ [`${t.member}.org_id`]: orgId })
      .orderBy(`${t.member}.created_at`, 'desc')
      .limit(limit)
      .offset(offset)

    const user = await this.returnUser(meta)

    return { status: 'success', data: relations, user }
  }
}

export type WhereOrg = { orgId: string } | { handle: string }

export type ManageOrganizationParams =
  | { _action: 'create', fields: Partial<Organization>, userId?: string, withDefaults?: boolean }
  | { _action: 'update', where: WhereOrg, fields: Partial<Organization> }
  | { _action: 'delete', where: WhereOrg }
  | { _action: 'read', where: WhereOrg }
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
      case 'read':
        return this.readOrganization(params, meta)
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

    return this.prepareResponse({ org: responseOrg, message: 'new secret API key was created', meta })
  }

  private async createOrganization(params: ManageOrganizationParams & { _action: 'create' }, meta: EndpointMeta): Promise<EndpointResponse<Organization> & { user?: User }> {
    const { fields, userId, withDefaults } = params
    const { orgName, orgEmail, orgId } = fields
    const defaultName = orgEmail?.split('@')[0] || 'Untitled Organization'

    const createFields = this.settings.fictionDb.prep({ type: meta.server ? 'internal' : 'insert', fields, meta, table: t.org })

    let responseOrg: Organization | undefined
    const [existingOrg] = await this.db()
      .select('*')
      .from(t.org)
      .where({ org_id: orgId || objectId({ prefix: 'org' }) })
      .limit(1)

    if (existingOrg) {
      responseOrg = existingOrg
    }
    else {
      if (createFields.handle) {
        createFields.handle = await ensureUniqueHandle({ db: this.db(), table: t.org, handle: createFields.handle, idColumn: 'orgId' })
      }

      const [newOrg] = await this.db()
        .insert({
          orgId: orgId || objectId({ prefix: 'org' }),
          orgName: orgName || defaultName,
          ...createFields,
        })
        .into(t.org)
        .returning<Organization[]>('*')

      responseOrg = newOrg

      if (!responseOrg?.orgId)
        throw new Error('Organization creation failed')

      await this.settings.fictionUser.hooks.run('newOrg', { org: responseOrg, userId, withDefaults })

      if (userId)
        await this.manageMemberRelation({ userId, orgId: responseOrg.orgId, accessType: 'owner' }, { server: true, ...meta, caller: 'orgCreateMemberRelationCall' })
    }

    if (!responseOrg)
      throw new Error('Organization creation failed')

    return this.prepareResponse({ org: responseOrg, message: 'Organization created', meta })
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

    if (updatedFields.handle && 'orgId' in where) {
      updatedFields.handle = await ensureUniqueHandle({ db: this.db(), table: t.org, handle: updatedFields.handle, excludeId: where.orgId, idColumn: 'orgId' })
    }

    this.log.debug('updateOrganization', { data: { where, updatedFields, fields } })

    const [responseOrg] = await this.db()
      .update(updatedFields)
      .where(where)
      .into(t.org)
      .returning<Organization[]>('*')

    return this.prepareResponse({ org: responseOrg, message: 'Successfully updated', meta })
  }

  private async deleteOrganization(params: ManageOrganizationParams & { _action: 'delete' }, meta: EndpointMeta): Promise<EndpointResponse<Organization> & { user?: User }> {
    const { where } = params
    this.validatePermission(where, meta)
    const [responseOrg] = await this.db()
      .delete()
      .from(t.org)
      .where(where)
      .returning<Organization[]>('*')

    return this.prepareResponse({ org: responseOrg, message: `Deleted organization`, meta })
  }

  private async readOrganization(params: ManageOrganizationParams & { _action: 'read' }, meta: EndpointMeta): Promise<EndpointResponse<Organization> & { user?: User }> {
    const { where } = params
    const [responseOrg] = await this.db().select('*').from(t.org).where(where)

    return this.prepareResponse({ org: responseOrg, meta })
  }

  // Additional helper functions for validation, member management, and response preparation
  private validatePermission(args: { orgId?: string, handle?: string }, meta: EndpointMeta) {
    if (meta.server)
      return

    if (meta.bearer?.orgs?.find(o => o.orgId === args.orgId || o.handle === args.handle))
      return

    throw abort('bearer privilege')
  }

  private async manageMemberRelation(args: { userId: string, orgId: string, accessType?: MemberAccess }, meta: EndpointMeta) {
    const { userId, orgId, accessType = 'owner' } = args
    return this.settings.fictionUser.queries.ManageMemberRelation.serve(
      {
        _action: 'create',
        orgId,
        fields: {
          userId,
          memberAccess: accessType,
          memberStatus: 'active',
        },
      },
      meta,
    )
  }

  private async prepareResponse(args: { org: Organization, message?: string, meta: EndpointMeta }): Promise<EndpointResponse<Organization> & { user?: User }> {
    const { org, message, meta } = args
    const user = await this.returnUser(meta)

    return { status: 'success', message, user, data: org }
  }
}

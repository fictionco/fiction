import type { Knex } from 'knex'
import type { FactorStripe } from '@factor/plugin-stripe'
import type { EndpointManageAction, EndpointMeta } from '../../utils'
import { Query } from '../../query'
import type { FactorDb } from '../../plugin-db'
import type {
  FactorUser,
  MemberAccess,
  MemberStatus,
  Organization,
  OrganizationMembership,
} from '../../plugin-user'
import type { User } from '../../plugin-user/types'
import type { EndpointResponse } from '../../types'

import type { FactorAdmin } from '../..'

export interface AdminQueryOptions {
  factorAdmin: FactorAdmin
  factorDb: FactorDb
  factorUser?: FactorUser
  factorStripe?: FactorStripe
}

export abstract class AdminQuery extends Query<AdminQueryOptions> {
  factorAdmin = this.settings.factorAdmin
  factorDb = this.settings.factorDb
  factorUser = this.settings.factorUser
  factorStripe = this.settings.factorStripe

  constructor(settings: AdminQueryOptions) {
    super(settings)
  }
}

export abstract class QueryOrganization extends AdminQuery {
  memberObject(): string {
    const memberObject = [
      ['user_id', this.tbl.user],
      ['email', this.tbl.user],
      ['full_name', this.tbl.user],
      ['last_seen_at', this.tbl.user],
      ['member_access', this.tbl.member],
      ['member_status', this.tbl.member],
    ]
      .map(([key, table]) => `'${key}', ${table}.${key}`)
      .join(', ')

    return memberObject
  }

  organizationBaseQuery(db: Knex): Knex.QueryBuilder {
    // const subQueryProject = db
    //   .select(
    //     db.raw(`json_agg(row_to_json(${this.tbl.project}.*)) as projects`),
    //     `${this.tbl.project}.organization_id`,
    //   )
    //   .from(this.tbl.org)
    //   .join(
    //     this.tbl.project,
    //     `${this.tbl.project}.organization_id`,
    //     `=`,
    //     `${this.tbl.org}.organization_id`,
    //   )
    //   .groupBy(`${this.tbl.project}.organization_id`)
    //   .as(`org_projects`)

    // lateral join is key to get a limit on number of aggregated members
    // it allows you to reference unevaluated fields
    // https://stackoverflow.com/a/61369692/1858322
    // memberCount: https://stackoverflow.com/a/28888696/1858322

    const subQueryMembers = db
      .select(
        db.raw(
          `json_agg(json_build_object(${this.memberObject()})) as members, max(member_count) as member_count`,
        ),
        `${this.tbl.org}.organization_id`,
      )
      .from(this.tbl.org)
      .joinRaw(
        `left join lateral (
        select *, count(*) OVER() AS member_count
        from "factor_organization_user"
        where "factor_organization_user".organization_id = "factor_organization"."organization_id"
        limit 5
      ) as "factor_organization_user" on true`,
      )
      .join(
        this.tbl.user,
        `${this.tbl.user}.user_id`,
        `=`,
        `${this.tbl.member}.user_id`,
      )
      .groupBy(`${this.tbl.org}.organization_id`)
      .as('org_member')

    const q = db
      .select([`${this.tbl.org}.*`, `org_member.*`])
      .from(this.tbl.org)
      .leftJoin(
        subQueryMembers,
        `org_member.organization_id`,
        `=`,
        `${this.tbl.org}.organization_id`,
      )

    return q
  }
}

export class QueryFindOneOrganization extends QueryOrganization {
  async run(
    params: {
      organizationId: string
      lastOrganizationId?: string
      relationUserId?: string
    },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<Organization>> {
    const { organizationId, lastOrganizationId, relationUserId } = params

    const db = this.factorDb.client()
    const q = this.organizationBaseQuery(db)

    const r = await q
      .where(`${this.tbl.org}.organization_id`, organizationId)
      .first<Organization | undefined>()

    const data = r
      ? this.factorAdmin.refineRawOrganization(
        {
          organization: r,
          lastOrganizationId,
          userId: relationUserId,
        },
        _meta,
      )
      : undefined

    return { status: 'success', data }
  }
}

export class QueryOrganizationsByUserId extends QueryOrganization {
  async run(
    params: {
      userId: string
      lastOrganizationId?: string
    },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<Organization[]>> {
    const { userId, lastOrganizationId } = params

    const db = this.factorDb.client()
    const q = this.organizationBaseQuery(db)
      .select(
        db.raw(`json_build_object(${this.memberObject()}) as relation`),
        `${this.tbl.org}.organization_id`,
      )
      .join(
        this.tbl.member,
        `${this.tbl.member}.organization_id`,
        '=',
        `${this.tbl.org}.organization_id`,
      )
      .join(
        this.tbl.user,
        `${this.tbl.user}.user_id`,
        '=',
        `${this.tbl.member}.user_id`,
      )
      .where<Organization[]>(`${this.tbl.member}.user_id`, userId)
      .orderBy(`${this.tbl.org}.updated_at`, 'desc')

    const r = await q

    const data = r
      .map((organization: Organization) =>
        this.factorAdmin.refineRawOrganization(
          {
            organization,
            lastOrganizationId,
            userId,
          },
          _meta,
        ),
      )
      .filter(Boolean) as Organization[]

    return { status: 'success', data }
  }
}

export class QueryUpdateOrganizationMemberStatus extends QueryOrganization {
  async run(
    params: {
      userId: string
      organizations: Organization[]
    },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<Organization[]>> {
    const db = this.factorDb.client()
    const { userId } = params
    let { organizations } = params

    organizations = await Promise.all(
      organizations.map(async (org) => {
        let ind = -1
        // is the current userId pending in this org?
        const pendingMember = org.members.find((_, i) => {
          if (_.userId === userId && _.memberStatus === 'pending') {
            ind = i
            return true
          }
          else { return false }
        })

        // if so, update to active
        if (pendingMember && ind >= 0) {
          await db
            .table(this.tbl.member)
            .update({ memberStatus: 'active' })
            .where({ organizationId: org.organizationId, userId })

          org.members[ind].memberStatus = 'active'
        }

        return org
      }),
    )

    return { status: 'success', data: organizations }
  }
}

export class QueryGenerateApiSecret extends AdminQuery {
  async run(
    params: { organizationId: string },
    meta: EndpointMeta,
  ): Promise<
    EndpointResponse<Organization> & {
      user?: User
    }
  > {
    if (!this.factorUser)
      throw new Error('no user service')
    if (!params.organizationId)
      throw this.stop('organizationId required')

    const { organizationId } = params

    if (!meta.bearer?.userId && !meta.server)
      throw this.stop('auth required for API secret generation')

    let org: Organization | undefined
    let message: string | undefined
    const db = this.factorDb.client()

    const { default: uuidAPIKey } = await import('uuid-apikey')

    const update: Record<string, any> = {
      apiSecret: uuidAPIKey.create().apiKey,
    }

    ;[org] = await db
      .table(this.tbl.org)
      .update(update)
      .where({ organizationId })
      .limit(1)
      .returning<Organization[]>('*')

    message = 'private API key created'

    // refresh user
    let user: User | undefined

    if (meta.bearer?.userId) {
      const { data: privateUser }
        = await this.factorUser.queries.ManageUser.serve(
          {
            _action: 'getPrivate',
            userId: meta.bearer.userId,
          },
          meta,
        )
      user = privateUser
    }

    return {
      status: 'success',
      data: org,
      user,
      message,
      organizationId: org?.organizationId,
    }
  }
}

export class QueryManageMemberRelation extends AdminQuery {
  async run(
    params: {
      _action: EndpointManageAction
      userId: string
      organizationId: string
      memberAccess?: MemberAccess
      memberStatus?: MemberStatus
      memberRole?: string
      invitedById?: string
    },
    meta: EndpointMeta,
  ): Promise<EndpointResponse<OrganizationMembership>> {
    if (!this.factorUser)
      throw new Error('no user service')
    if (!meta.bearer && !meta.server)
      throw this.stop('auth required')
    const {
      userId,
      organizationId,
      _action,
      memberAccess,
      memberStatus,
      memberRole,
      invitedById,
    } = params

    const db = this.factorDb.client()

    let relation: OrganizationMembership | undefined
    if (_action === 'delete') {
      ;[relation] = await db
        .delete()
        .from(this.tbl.member)
        .where({ userId, organizationId })
        .limit(1)
        .returning<OrganizationMembership[]>('*')
    }
    else if (_action === 'create' || _action === 'update') {
      // Add relation
      ;[relation] = await db
        .insert({
          userId,
          organizationId,
          memberAccess,
          memberStatus,
          memberRole,
          invitedById,
        })
        .onConflict(['user_id', 'organization_id'])
        .merge()
        .into(this.tbl.member)
        .returning<OrganizationMembership[]>('*')
    }

    // replace user state to ensure teams update
    const { data: user } = await this.factorUser.queries.ManageUser.serve(
      {
        _action: 'getPrivate',
        userId,
      },
      meta,
    )

    return { status: 'success', data: relation, user }
  }
}

interface OrganizationEditableFields {
  organizationEmail?: string
  organizationName?: string
  organizationSize?: number
  manageClients?: boolean
  memberRole?: string
}

type ManageOrganizationParams =
  | ({
    _action: 'create'
    email?: string
    userId: string
  } & OrganizationEditableFields)
  | ({
    _action: 'update'
    organizationId: string
  } & OrganizationEditableFields)
  | { _action: 'delete', organizationId: string }

export class QueryManageOrganization extends AdminQuery {
  async run(
    params: ManageOrganizationParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<Organization> & { user?: User }> {
    if (!this.factorUser)
      throw new Error('no user service')
    const { _action } = params
    const { bearer, server } = meta
    if (!bearer && !server)
      throw this.stop('bearer required')

    const db = this.factorDb.client()

    let org: Organization | undefined
    let message: string | undefined

    if (_action === 'delete' || _action === 'update') {
      const { organizationId } = params
      if (!organizationId)
        throw this.stop('organizationId required')
      if (
        !server
        && !bearer?.organizations?.find(o => o.organizationId === organizationId)
      ) {
        throw this.stop({
          message: 'bearer privilege',
          data: {
            bearerOrgs: bearer?.organizations?.map(o => o.organizationId),
            organizationId,
          },
        })
      }
    }

    if (_action === 'create') {
      const { userId, email, organizationEmail, organizationName, memberRole }
        = params

      if (!userId || (!server && bearer?.userId !== userId))
        throw this.stop({ message: 'bearer mismatch', data: { meta, params } })

      ;[org] = await db
        .insert({
          organizationName: organizationName || email?.split('@')[0],
          ownerId: userId,
          organizationEmail: organizationEmail || email,
        })
        .into(this.tbl.org)
        .returning<Organization[]>('*')

      await this.factorAdmin.queries.ManageMemberRelation.serve(
        {
          userId,
          organizationId: org.organizationId,
          memberAccess: 'owner',
          memberStatus: 'active',
          memberRole,
          _action: 'create',
        },
        meta,
      )

      if (!org.organizationId)
        throw new Error('organizationId missing')

      message = `created "${org.organizationName}" organization`
    }
    else if (_action === 'update') {
      const { organizationId, organizationEmail, organizationName } = params

      await this.factorStripe?.queries.ManageCustomer.serve(
        {
          _action: 'update',
          email: organizationEmail,
          name: organizationName,
        },
        { server: true },
      )
      ;[org] = await db
        .update({
          organizationEmail,
          organizationName,
        })
        .into(this.tbl)
        .where({ organizationId })
        .limit(1)
        .returning<Organization[]>('*')

      message = `updated "${org.organizationName}" organization`
    }
    else if (_action === 'delete') {
      const { organizationId } = params
      ;[org] = await db
        .delete()
        .from(this.tbl)
        .where({ organizationId })
        .limit(1)
        .returning<Organization[]>('*')

      message = `deleted "${org.organizationName}" organization`
    }

    let user: User | undefined
    if (bearer?.userId) {
      const response = await this.factorUser.queries.ManageUser.serve(
        {
          _action: 'getPrivate',
          userId: bearer.userId,
        },
        meta,
      )

      user = response.data
    }

    return { status: 'success', message, user, data: org }
  }
}

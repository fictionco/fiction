import { getDb } from '@factor/engine/db'
import { FactorTable } from '@factor/types'
import type { Knex } from 'knex'
import type { Organization, Project } from '@kaption/types'
import { AppTable, MemberStatus } from '@kaption/types'
import { getStripeProduct } from '@factor/plugin-stripe'

const o = AppTable.Organizations
const mem = AppTable.OrganizationMembers
const s = AppTable.Projects
const usr = FactorTable.User

function memberObject(): string {
  const memberObject = [
    ['user_id', usr],
    ['email', usr],
    ['full_name', usr],
    ['last_seen', usr],
    ['member_access', mem],
    ['member_status', mem],
  ]
    .map(([key, table]) => `'${key}', ${table}.${key}`)
    .join(', ')

  return memberObject
}

export function organizationBaseQuery(db: Knex): Knex.QueryBuilder {
  const subQuerySite = db
    .select(
      db.raw(`json_agg(row_to_json(${s}.*)) as projects`),
      `${s}.organization_id`,
    )
    .from(o)
    .join(s, `${s}.organization_id`, `=`, `${o}.organization_id`)
    .groupBy(`${s}.organization_id`)
    .as(`org_projects`)

  const subQueryMembers = db
    .select(
      db.raw(`json_agg(json_build_object(${memberObject()})) as members`),
      `${o}.organization_id`,
    )
    .from(o)
    .join(mem, `${mem}.organization_id`, '=', `${o}.organization_id`)
    .join(usr, `${usr}.user_id`, `=`, `${mem}.user_id`)
    .groupBy(`${o}.organization_id`)
    .as('org_member')

  const q = db
    .select(['members', 'projects', `${o}.*`])
    .from(o)
    .leftJoin(
      subQuerySite,
      `org_projects.organization_id`,
      `=`,
      `${o}.organization_id`,
    )
    .leftJoin(
      subQueryMembers,
      `org_member.organization_id`,
      `=`,
      `${o}.organization_id`,
    )

  return q
}
/**
 * Modify the organization from the DB for runtime use
 */
export function refineRawOrganization(org: Organization): Organization {
  // use development/test values for customer in development mode
  if (process.env.NODE_ENV === 'development') {
    org.customer = org.customerTest
    org.customerId = org.customerIdTest

    delete org.customerTest
    delete org.customerIdTest
  }

  const productId = org.customer?.productId
  const planName = getStripeProduct({ productId })?.key ?? 'free'

  org.plan = {
    name: planName,
    status: org.customer?.subscriptionStatus,
  }

  // remove nulls from empty joins
  org.members = org.members ?? []
  org.projects = org.projects ?? []

  return org
}
/**
 * get a site by Id
 */
export async function findOneProject(args: {
  projectId?: string
}): Promise<Project> {
  const { projectId } = args
  const db = await getDb()

  const project = await db
    .select<Project>('*')
    .from(AppTable.Projects)
    .where({ projectId })
    .first()

  return project
}
/**
 * Get one organization from the DB by organizationId
 */
export async function findOneOrganization(organizationId: string): Promise<Organization | undefined> {
  const db = await getDb()
  const q = organizationBaseQuery(db)

  const finalQuery = q.where(`${o}.organization_id`, organizationId).first()

  const r = await finalQuery

  if (!r)
    return

  return refineRawOrganization(r)
}
/**
 * Get all organizations and sites associated with those organizations
 * tied to a specific user
 */
export async function getOrganizationsByUserId(userId: string): Promise<Organization[]> {
  const db = await getDb()
  const q = organizationBaseQuery(db)

  const finalQuery = q
    .join(mem, `${mem}.organization_id`, '=', `${o}.organization_id`)
    .where(`${mem}.user_id`, userId)

  const r = await finalQuery

  return r.map((_: Organization) => refineRawOrganization(_))
}

export async function updateMemberStatusFromPending(userId: string, orgs: Organization[]): Promise<Organization[]> {
  const db = await getDb()
  orgs = await Promise.all(
    orgs.map(async (org) => {
      let ind = -1
      // is the current userId pending in this org?
      const pendingMember = org.members.find((_, i) => {
        if (_.userId === userId && _.memberStatus === MemberStatus.Pending) {
          ind = i
          return true
        }
        else { return false }
      })

      // if so, update to active
      if (pendingMember && ind >= 0) {
        await db
          .table(mem)
          .update({ memberStatus: 'active' })
          .where({ organizationId: org.organizationId, userId })

        org.members[ind].memberStatus = MemberStatus.Active
      }

      return org
    }),
  )

  return orgs
}

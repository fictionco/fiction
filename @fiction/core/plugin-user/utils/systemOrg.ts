import type { FictionUser } from '..'
import type { Organization, User } from '../types'
import { isNode } from '../../utils'

export async function setupSystemOrg(args: { fictionUser: FictionUser }) {
  if (typeof window !== 'undefined')
    return

  const { fictionUser } = args

  const { fictionEnv } = fictionUser.settings
  const { email, name, systemOrgId = 'fiction_system_org', admins = [] } = fictionEnv.meta || {}

  if (!email || !name)
    throw new Error('No email or name for app')

  // Ensure system owner and org exist
  const { user } = await ensureUserAndOrganization({ orgName: name, email, orgId: systemOrgId, fictionUser })

  // Create admins and track valid member IDs
  const validMemberIds = [user.userId]
  await Promise.all(admins.map(async (adminEmail) => {
    const { data: admin } = await fictionUser.queries.ManageUser.serve(
      { _action: 'getCreate', where: { email: adminEmail }, createUserFields: { needsOnboarding: false } },
      { server: true },
    )
    if (admin?.userId) {
      validMemberIds.push(admin.userId)
      await fictionUser.queries.ManageMemberRelation.serve({
        _action: 'create',
        orgId: systemOrgId,
        fields: { userId: admin.userId, memberAccess: 'admin', memberStatus: 'active' },
      }, { server: true })
    }
  }))

  // Get and remove unauthorized members
  const { data: currentMembers = [] } = await fictionUser.queries.ManageMemberRelation.serve({ _action: 'list', orgId: systemOrgId }, { server: true })

  await Promise.all(
    currentMembers
      .filter(member => !validMemberIds.includes(member.userId))
      .map(member => fictionUser.queries.ManageMemberRelation.serve({ _action: 'delete', where: { userId: member.userId }, orgId: systemOrgId }, { server: true })),
  )

  fictionUser.log.info(`System org setup: ${validMemberIds.length} admins`)
}

async function ensureUserAndOrganization({ email, orgName, orgId, fictionUser }: { email: string, orgName: string, orgId?: string, fictionUser: FictionUser }): Promise<{ user: User, org: Organization }> {
  if (!isNode())
    throw new Error('Server-only operation')
  if (!email)
    throw new Error('Missing email in app meta')

  const { data: user } = await fictionUser.queries.ManageUser.serve(
    { _action: 'getCreate', where: { email }, createUserFields: { orgId, orgName, email, needsOnboarding: false } },
    { server: true },
  )

  if (!user?.orgs?.[0])
    throw new Error('User or organization not found')

  return { user, org: user.orgs[0] }
}

import type { FictionUser } from '..'

export async function setupSystemOrg(args: { fictionUser: FictionUser }) {
  if (typeof window !== 'undefined')
    return

  const { fictionUser } = args

  const { fictionEnv } = fictionUser.settings
  const { email, name, systemOrgId = 'system', admins = [] } = fictionEnv.meta || {}

  if (!email || !name)
    throw new Error('No email or name for app')

  const r = await fictionUser.queries.ManageOrganization.serve(
    { _action: 'create', fields: { orgId: systemOrgId, orgName: name, orgEmail: email } },
    { server: true },
  )

  const orgId = r.data?.orgId
  if (orgId !== systemOrgId) {
    throw new Error(`System org ID mismatch: ${orgId} !== ${systemOrgId}`)
  }

  const adminList = [email, ...(admins || [])]

  // Create admins and track valid member IDs
  const validMemberIds: string[] = []
  await Promise.all(adminList.map(async (email) => {
    const { data: admin } = await fictionUser.queries.ManageUser.serve(
      { _action: 'getCreate', where: { email }, createUserFields: { needsOnboarding: true } },
      { server: true },
    )

    if (admin?.userId) {
      validMemberIds.push(admin.userId)
      await fictionUser.queries.ManageMemberRelation.serve({
        _action: 'create',
        orgId,
        fields: { userId: admin.userId, memberAccess: 'admin', memberStatus: 'active' },
      }, { server: true })
    }
  }))

  fictionUser.log.info(`System org setup(${systemOrgId}): ${validMemberIds.length} admins`)
}

import clearbit from 'clearbit'
import type { FullUser } from '@factor/api'
import { log } from '@factor/api'
import type { FactorUser } from '@factor/api/plugin-user'

export async function enrichUser(params: {
  user: FullUser
  factorUser: FactorUser
}): Promise<void> {
  const { user, factorUser } = params
  const email = user.email
  try {
    const clearbitClient = clearbit('sk_3845110a87edaa1e1b726d41cadfd12d')

    const result = await clearbitClient.Person.find({
      email,
    })

    const fields: Partial<FullUser> = {}

    if (!user.fullName && result.name?.fullName)
      fields.fullName = result.name.fullName

    if (!user.location && result.location)
      fields.location = result.location

    if (!user.bio && result.bio)
      fields.bio = result.bio

    if (!user.site && result.site)
      fields.site = result.site

    if (!user.github && result.github?.handle)
      fields.github = result.github?.handle

    if (!user.githubFollowers && result.github?.followers)
      fields.githubFollowers = result.github?.followers

    if (!user.linkedin && result.linkedin?.handle)
      fields.linkedin = result.linkedin?.handle

    if (!user.twitter && result.twitter?.handle)
      fields.twitter = result.twitter?.handle

    if (!user.twitterFollowers && result.twitter?.followers)
      fields.twitterFollowers = result.twitter?.followers

    if (!user.facebook && result.facebook?.handle)
      fields.facebook = result.facebook?.handle

    if (!user.workDomain && result.employment?.domain)
      fields.workDomain = result.employment?.domain

    if (!user.workTitle && result.employment?.title)
      fields.workTitle = result.employment?.title

    if (!user.workName && result.employment?.name)
      fields.workName = result.employment?.name

    if (!user.workRole && result.employment?.role)
      fields.workRole = result.employment?.role

    if (!user.workSeniority && result.employment?.seniority)
      fields.workSeniority = result.employment?.seniority

    if (!user.workRoleSub && result.employment?.subRole)
      fields.workRoleSub = result.employment?.subRole

    const updateResult = await factorUser.queries.ManageUser.serve(
      {
        email,
        fields,
        _action: 'update',
      },
      undefined,
    )

    log.info('enrichUser', `info added ${email}`, { data: updateResult })
  }
  catch (error) {
    log.error('enrichUser', `info added error: ${email}`, { error })
  }
}

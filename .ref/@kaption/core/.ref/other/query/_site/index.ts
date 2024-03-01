import { _stop, bustCdnCache, projectDetailsRefreshCache } from '@kaption/utils'
import type { TrackingStatus } from '@kaption/types'
import dayjs from 'dayjs'
import type { EPAction } from '../serverTypes'
import { baseQuery, runQuery } from '../base'

/**
 * Clears the cache for a site script.. Needed when settings change
 */
export const bustSiteScript: EPAction<'bustSiteScript'> = async ({
  projectId,
}) => {
  const distributionId = process.env.SCRIPT_DISTRIBUTION_ID

  if (!distributionId)
    throw _stop({ message: 'no distribution found' })

  // bust cloudfront cache
  const r = await bustCdnCache({
    distributionId,
    paths: [`/${projectId}.*`],
  })

  // clear the redis site cache
  projectDetailsRefreshCache(projectId)

  return { status: 'success', data: r }
}

export const getTrackingStatus: EPAction<'getTrackingStatus'> = async ({
  projectId,
}) => {
  const inputs = { projectId, tableName: 'event' } as const

  let status: TrackingStatus

  // check for any events in the last month
  const clickhouseTimeEnd = dayjs().add(1, 'day').utc().format('YYYYMMDDHHmmss')
  const clickhouseTimeStart = dayjs()
    .subtract(1, 'month')
    .utc()
    .format('YYYYMMDDHHmmss')

  const q = baseQuery(inputs)
    .select('sessionId')
    .whereRaw(
      `toYYYYMMDDhhmmss(timestamp) BETWEEN ${clickhouseTimeStart} AND ${clickhouseTimeEnd}`,
    )

  const { data: r } = await runQuery<string[]>(q)

  if (r && r.length > 0)
    status = 'active'
  else
    status = 'noData'

  return { status: 'success', data: status }
}

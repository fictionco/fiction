import type { SessionFields } from '@kaption/types'
import { _stop } from '@kaption/utils'
import type { Knex } from 'knex'
import { baseQuery, dateQuery, qu, runQuery } from '../../base'
import type { ComparedDataItem, RequestFullAnalyticsRefined } from '../types'
import { removeSessionQueryPrefix } from '../helpers'
import type { EPAction } from '../../serverTypes'

type QueryBuilder = Knex.QueryBuilder<any, any>

const selectItems = [
  'sessionId',
  'any(projectId) as session_projectId',
  'any(clientId) as clientId',
  'max(isNew) as isNew',
  'min(formatDateTime(timestamp, \'%FT%T.000Z\', \'UTC\')) as startTime',
  'max(formatDateTime(timestamp, \'%FT%T.000Z\', \'UTC\')) as endTime',
  'anyIf(entryPage, eventName=\'session\') as entryPage',
  'anyIf(exitPage, eventName=\'session\') as exitPage',
  'sum(engageDuration) as engageDuration',
  'countIf(eventName=\'view\') as pageCount',
  'if(countIf(eventName=\'bot\') > 0, 1, 0) as isRobot',
  'if(countIf(eventName=\'replay\') > 0 , 1, 0) as hasReplay',
  'sum(replayDuration) as replayDuration',
  'if(pageCount > 1, 0, 1) as isBounce',
  'sum(value) as value',

  'if(countIf(eventType=\'macro\') > 0, 1, 0) as hasMacroConversion',
  'if(countIf(eventType=\'macro\') > 0, 1, 0) as hasMacroConversion',
  'uniq(eventId) as eventCount',
  'anyIf(os, eventName=\'init\') as os',
  'anyIf(browser, eventName=\'init\') as browser',
  'anyIf(referrer, eventName=\'init\') as referrer',
  'anyIf(referralSource, eventName=\'init\') as referralSource',
  'anyIf(referralCampaign, eventName=\'init\') as referralCampaign',
  'anyIf(referralMedium, eventName=\'init\') as referralMedium',
  'anyIf(deviceType, eventName=\'init\') as deviceType',
  'anyIf(timezone, eventName=\'init\') as timezone',
  'anyIf(city, eventName=\'init\') as city',
  'anyIf(regionName, eventName=\'init\') as regionName',
  'anyIf(language, eventName=\'init\') as language',
  'anyIf(countryCode, eventName=\'init\') as countryCode',
  'sum(scrollTotal) as session_scrollTotal',
  'sum(keypressTotal) as session_keypressTotal',
  'sum(moveTotal) as session_moveTotal',
  'sum(touchTotal) as session_touchTotal',
  'sum(clickTotal) as session_clickTotal',
  'sum(scrollTotal + keypressTotal + moveTotal + touchTotal + clickTotal) as interactionTotal',
  'groupUniqArray(10)(eventName) as eventList',
]

export const singleSession: EPAction<'singleSession'> = async (args) => {
  const { id } = args

  if (!id)
    throw _stop({ message: 'sessionId is missing (id)' })

  const dbQuery: QueryBuilder = qu()
    .select('*')
    .from(
      baseQuery(args)
        .select(qu().raw(selectItems.join(', ')))
        .groupBy('sessionId')
        .where({ sessionId: id }),
    )

  const { data } = await runQuery<Partial<SessionFields>[]>(dbQuery)

  return { status: 'success', data: removeSessionQueryPrefix(data)[0] }
}

export async function listReplay(q: RequestFullAnalyticsRefined): Promise<ComparedDataItem<SessionFields>> {
  const { limit = 100 } = q

  const dbQuery = qu()
    .select('*')
    .from(
      dateQuery(q)
        .select(qu().raw(selectItems.join(', ')))
        .groupBy('sessionId'),
    )
    .where({ hasReplay: 1 })
    .orderBy('startTime', 'desc')
    .limit(limit)

  const { data: r } = await runQuery<any[]>(dbQuery)

  const main = removeSessionQueryPrefix(r) as SessionFields[]

  return { main }
}

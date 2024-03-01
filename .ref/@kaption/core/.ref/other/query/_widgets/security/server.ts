import { _stop } from '@kaption/utils'
import type { Knex } from 'knex'
import { dateQuery, qu, runQuery } from '../../base'
import type { AggregationResponse, ComparedDataItem, QueryMapItem } from '../types'

const selectItems = [
  'count(*) as totalEvents',
  'uniq(clientId) as uniqueVisitors',
  'uniqIf(clientId, isNew=0) as returningVisitors',
  'min(timestamp) as session_timestamp',
  'sum(engageDuration) as session_engageDuration',
  'countIf(eventName=\'view\') as pageCount',
  'if(countIf(eventName=\'bot\') > 0, 1, 0) as isRobot',
  'if(pageCount > 1, 0, 1) as isBounce',
  'uniq(eventId) as eventCount',
  'any(clientId) as session_clientId',
  'anyIf(referrer, eventName=\'init\') as session_referrer',
  'anyIf(referralSource, eventName=\'init\') as session_referralSource',
  'anyIf(referralCampaign, eventName=\'init\') as session_referralCampaign',
  'anyIf(referralMedium, eventName=\'init\') as session_referralMedium',
  'anyIf(deviceType, eventName=\'init\') as session_deviceType',
  'anyIf(city, eventName=\'init\') as session_city',
  'anyIf(countryCode, eventName=\'init\') as session_countryCode',
]
export async function locationAggregation(q: QueryMapItem): Promise<ComparedDataItem<AggregationResponse>> {
  const { limit = 12, groupBy } = q

  if (!groupBy)
    throw _stop({ message: 'aggregation: no groupBy' })

  const base: Knex.QueryBuilder = qu().from(
    dateQuery(q)
      .select(qu().raw(selectItems.join(', ')))
      .groupBy('sessionId'),
  )

  const select = [`sum(isRobot) as count`, `${groupBy} as name`]

  const dbQuery = base
    .select(qu().raw(select.join(',')))
    .groupByRaw(`${groupBy} WITH ROLLUP`)
    .whereNot({ [groupBy]: '' })
    .orderBy('count', 'desc')
    .limit(limit)

  const { data: main } = await runQuery<AggregationResponse[]>(dbQuery)
  const mainTotals = main.shift()
  return { main, mainTotals }
}

export async function qualityAggregation(q: QueryMapItem): Promise<ComparedDataItem<AggregationResponse>> {
  const { groupBy, limit = 12, where } = q

  if (!groupBy)
    throw _stop({ message: 'aggregation: no groupBy' })

  let base: Knex.QueryBuilder = qu().from(
    dateQuery(q)
      .select(qu().raw(selectItems.join(', ')))
      .groupBy('sessionId'),
  )

  base = base.whereNot({ [groupBy]: '' })

  if (where)
    base = base.where(where)

  const select = [
    `avg(isRobot) as count`,
    `sum(isRobot) as amount`,
    `${groupBy} as name`,
    `sum(uniqueVisitors) as uniques`,
    `topK(1)(session_referrer) as url`,
  ]

  const dbQuery = qu()
    .select('*')
    .from(
      base
        .select(qu().raw(select.join(',')))
        .groupBy(groupBy)
        .orderBy('count', 'desc'),
    )
    .whereRaw(`amount > 10`)
    .limit(limit)

  // console.log("Q", dbQuery.toString())

  const { data: main } = await runQuery<AggregationResponse[]>(dbQuery)

  return { main }
}

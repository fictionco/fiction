import { _stop } from '@kaption/utils'
import { findOneExperiment } from '@kaption/db/property'
import type { Experiment, Variant } from '@kaption/types'
import type { Knex } from 'knex'
import type { ComparedDataItem, QueryMapItem } from '../types'
import { dateQuery, qu, runQuery } from '../../base'
import { formatDateTimeSelect } from '../helpers'
import type { GoalResult, RawGoalResult } from './types'
import { getZPercent } from './util'

interface VariantBase {
  variantId: string
  variantName: string
  experimentId: string
}
type VariantResult = {
  totalSessions: string | number
  uniqueVisitors: string | number
  totalGoal?: string | number
  conversions?: string | number
  rate?: string | number
} & VariantBase

type VariantStatisticalResult = VariantResult &
  Partial<Variant> & {
    stdErr?: number
    zScore?: number
    significance?: number
    highRate?: number
    lowRate?: number
    highChange?: number | string
    lowChange?: number | string
    improvement?: number | string
  }

function getAlias(variantId: string, item: 'users' | 'conversion' | 'rate'): string | number {
  return `V${variantId}__${item}`
}

function processVariantResults(args: {
  result: RawGoalResult[]
  variants: Record<string, Variant>
}): GoalResult[] {
  const { result, variants } = args

  return result.map((r) => {
    const { date, uniqueVisitors, totalSessions } = r
    return {
      date,
      uniqueVisitors,
      totalSessions,
      variantSet: Object.values(variants).map((v) => {
        return {
          variant: v,
          users: r[getAlias(v.variantId, 'users')],
          conversion: r[getAlias(v.variantId, 'conversion')],
          rate: r[getAlias(v.variantId, 'rate')],
        }
      }),
    }
  })
}

function getControlVariant(experimentId: string): VariantBase {
  return {
    variantId: 'control',
    variantName: 'Control',
    experimentId,
  }
}

async function getExperiment(q: QueryMapItem): Promise<Experiment & { variants: Record<string, Variant> }> {
  const { id: experimentId, projectId } = q

  if (!experimentId)
    throw _stop({ message: 'experiment id required' })

  const experiment = await findOneExperiment({ projectId, experimentId })

  if (!experiment)
    throw _stop({ message: 'could not find experiment' })

  const { goals = [], variants = {} } = experiment

  // add in 'control' variant
  variants.control = getControlVariant(experimentId)

  return { ...experiment, variants, goals }
}

/**
 * Create the base query for variants
 * @note don't directly await a query builder
 * this will attempt to run the query
 */
async function variantBaseQuery(experimentId: string, goalEvent: string, q: QueryMapItem): Promise<{ base: Knex.QueryBuilder }> {
  const sessionItems = [
    'uniq(sessionId) as sessions',
    'max(clientId) as clientId',
    'min(timestamp) as session_timestamp',
    'max(experiments.variantId) as variantId',
    'max(experiments.variantName) as variantName',
    'max(experiments.experimentId) as experimentId',
    'max(experiments.experimentName) as experimentName',
    `countIf(eventName='${goalEvent}') as totalGoal`,
    `if(totalGoal > 0, 1, 0) as hasGoal`,
    `countIf(eventName = 'view') as views`,
  ]

  const sessionSubQuery = dateQuery(q)
    .select(qu().raw(sessionItems.join(', ')))
    .joinRaw('left array join experiments')
    .groupBy('sessionId')

  const base = qu().from(sessionSubQuery).where({ experimentId })

  return { base }
}

function getStdErr(p: number, visits: number): number {
  return Math.sqrt((p * (1 - p)) / +visits)
}
function getZScore(args: {
  p: number
  num: number
  err: number
  pControl: number
  errControl: number
  numControl: number
}): number {
  const { p, err, pControl, errControl } = args
  return (pControl - p) / Math.sqrt(errControl ** 2 + err ** 2)
}

function percentChange(r1: number, rControl: number): number {
  return (r1 - rControl) / rControl
}

function processStatistics(results: VariantResult[], experiment: Experiment): VariantStatisticalResult[] {
  const resultWithStdErr = results.map((r) => {
    const { uniqueVisitors, conversions = 0 } = r

    const rate = +conversions / +uniqueVisitors
    const stdErr = getStdErr(rate, +uniqueVisitors)

    return { ...r, rate, stdErr }
  })

  let controlResult: VariantStatisticalResult | undefined
    = resultWithStdErr.find(_ => _.variantName === 'control')

  const variantResults = resultWithStdErr.filter(
    _ => _.variantName !== 'control',
  )
  if (!controlResult) {
    controlResult = {
      ...getControlVariant(experiment.experimentId),
      rate: 0,
      stdErr: 0,
      uniqueVisitors: 0,
      totalSessions: 0,
      conversions: 0,
    }
  }

  const {
    rate: controlRate,
    stdErr: controlErr,
    uniqueVisitors: controlVisitors,
  } = controlResult

  const variantStatisticalResults: VariantStatisticalResult[]
    = variantResults.map((r) => {
      const { rate, stdErr, uniqueVisitors } = r

      if (!controlRate || !controlErr)
        return r

      const zScore = getZScore({
        p: rate,
        pControl: +controlRate,
        err: stdErr,
        num: +uniqueVisitors,
        errControl: controlErr,
        numControl: +controlVisitors,
      })

      const significance = getZPercent(zScore)
      const highRate = rate + stdErr * zScore
      const lowRate = rate - stdErr * zScore

      return {
        ...r,
        zScore,
        significance,
        improvement: percentChange(rate, +controlRate),
        highRate,
        lowRate,
        highChange: percentChange(highRate, +controlRate),
        lowChange: percentChange(lowRate, +controlRate),
      }
    })

  variantStatisticalResults.unshift(controlResult)
  return variantStatisticalResults
}

export async function variantTable(q: QueryMapItem): Promise<ComparedDataItem<VariantResult>> {
  const { options: { goalIndex = 0 } = {}, title } = q
  const experiment = await getExperiment(q)

  const { experimentId, goals, variants, variantWeights } = experiment

  const goalEvent = goals[goalIndex]

  const { base } = await variantBaseQuery(experimentId, goalEvent, q)

  const select = [
    'variantId',
    'any(variantName) as variantName',
    `uniq(clientId) as uniqueVisitors`,
    `countIf(hasGoal) as conversions`,
  ]
  const dbQuery = base
    .select(qu().raw(select.join(', ')))
    .groupBy('variantId')
    .orderBy('uniqueVisitors', 'desc')
    .whereIn('variantId', Object.keys(variants))

  const { data: r } = await runQuery<VariantResult[]>(dbQuery)

  const main = processStatistics(r, experiment).map((_) => {
    const config = variants?.[_.variantId]
    const weight = variantWeights?.[_.variantId] ?? 0
    return { ...config, weight, ..._ }
  })

  const newTitle = `${title} (${goalEvent || 'Not Set'})`

  return { main, title: newTitle }
}

export async function variantResults(q: QueryMapItem): Promise<ComparedDataItem<GoalResult>> {
  const { interval, options: { goalIndex = 0 } = {}, title, timeZone } = q

  const experiment = await getExperiment(q)

  const { variants, goals, experimentId } = experiment

  const goalEvent = goals[goalIndex]

  const newTitle = `${title} (${goalEvent ?? 'Not Set'})`

  if (!goalEvent)
    throw _stop({ message: 'goal is not set', data: { title: newTitle } })

  const { base } = await variantBaseQuery(experimentId, goalEvent, q)

  const variantSelectors = Object.values(variants).flatMap((v) => {
    const visitorsAlias = getAlias(v.variantId, 'users')
    const conversionAlias = getAlias(v.variantId, 'conversion')
    const rateAlias = getAlias(v.variantId, 'rate')
    return [
      `uniqIf(clientId, variantId='${v.variantId}') as ${visitorsAlias}`,
      `uniqIf(clientId, variantId='${v.variantId}' AND hasGoal) as ${conversionAlias}`,
      `round(divide(${conversionAlias}, ${visitorsAlias}) * 100, 1) as ${rateAlias}`,
    ]
  })

  const sel = [
    `${formatDateTimeSelect({
      interval,
      timeZone,
      timeField: 'session_timestamp',
    })} as date`,
    `sum(sessions) as totalSessions`,
    `uniq(clientId) as uniqueVisitors`,
    ...variantSelectors,
  ]
  const dbQuery = base
    .select(qu().raw(sel.join(', ')))
    .groupByRaw('date WITH ROLLUP')
    .orderBy('date')

  const { data: r } = await runQuery<RawGoalResult[]>(dbQuery)

  const main = processVariantResults({ result: r, variants })

  const mainTotals = main.shift()

  return { main, mainTotals, title: newTitle }
}

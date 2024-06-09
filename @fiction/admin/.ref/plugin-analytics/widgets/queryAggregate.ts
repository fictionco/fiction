import type { Knex } from 'knex'
import type {
  DataCompared,
  QueryParamsRefined,
  QueryWidgetOptions,
} from '@factor/api/plugin-dashboards'
import { QueryWidget } from '@factor/api/plugin-dashboards'
import type { AggregationResponse } from '../types'

type AggregationQueryOptions = {
  countOn?: string
  where?: Record<string, string | number>
  selectors?: string[]
  noRollup?: boolean
  q?: (q: Knex.QueryBuilder) => Knex.QueryBuilder
} & QueryWidgetOptions

export class QueryWidgetAggregation extends QueryWidget<AggregationQueryOptions> {
  selectors = this.settings.selectors || []
  countOn = this.settings.countOn || `uniq(anonymousId)`
  limit = 12
  kaptionClickHouse = this.settings.kaptionClickHouse
  noRollup = this.settings.noRollup || false
  q = this.settings.q
  constructor(options: AggregationQueryOptions) {
    super(options)
  }

  aggregationQuery = async (
    params: QueryParamsRefined,
  ): Promise<DataCompared<AggregationResponse>> => {
    const ch = this.kaptionClickHouse

    if (!ch)
      throw new Error('kaptionClickHouse missing')

    const db = ch.client()

    if (!this.groupBy)
      throw new Error('aggregation: no groupBy')

    const { limit = 12 } = params

    // don't filter if groupBy is same, since it will just list one item
    params.filters = params.filters?.filter(f => f.name !== this.groupBy)

    let base: Knex.QueryBuilder
    if (this.table === 'eventSession')
      base = ch.clickhouseDateQuerySession({ params })
      //   this.countOn = this.countOn.replace("anonymousId", "session_anonymousId")
    else
      base = ch.clickhouseDateQuery({ params })

    if (this.where)
      base = base.where(this.where)

    if (this.q)
      base = this.q(base)

    const select = [`${this.countOn} as count`, `${this.groupBy} as name`]

    if (this.selectors.length > 0)
      select.push(...this.selectors)

    const groupByQuery = this.noRollup
      ? this.groupBy
      : `${this.groupBy} with ROLLUP`

    const dbQuery = base
      .select(db.raw(select.join(',')))
      .groupByRaw(groupByQuery)
      .whereNot({ [this.groupBy]: '' })
      .orderBy('count', 'desc')
      .limit(limit)

    const sql = dbQuery.toQuery()

    const { data: main } = await ch.clickHouseSelect<AggregationResponse[]>(
      dbQuery,
    )

    const mainTotals = this.noRollup ? undefined : main.shift()

    return { main, mainTotals, sql }
  }

  async query(
    params: QueryParamsRefined,
  ): Promise<DataCompared<AggregationResponse>> {
    return await this.aggregationQuery(params)
  }
}

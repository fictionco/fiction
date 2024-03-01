import type { Knex } from 'knex'
import type {
  DataCompared,
  DataPointChart,
  QueryParamsRefined,
  QueryWidgetOptions,
} from '@factor/api/plugin-dashboards'
import { QueryWidget } from '@factor/api/plugin-dashboards'
import { fillData } from '../../plugin-clickhouse/utils'

export class QueryWidgetChart extends QueryWidget {
  selectors = this.settings.selectors || []

  constructor(options: QueryWidgetOptions) {
    super(options)
  }

  async chartQuery(
    params: QueryParamsRefined,
  ): Promise<DataCompared<DataPointChart>> {
    const ch = this.kaptionClickHouse
    if (!ch)
      throw new Error('no clickhouse service')
    const db = ch.client()

    const { performance } = await import('node:perf_hooks')
    const p1 = performance.now()
    const { interval, timeZone } = params

    let base: Knex.QueryBuilder

    let timeField: 'timestamp' | 'session_timestamp' = 'timestamp'

    if (this.table === 'eventSession') {
      base = ch.clickhouseDateQuerySession({ params })
      timeField = 'session_timestamp'
    }
    else {
      base = ch.clickhouseDateQuery({ params })
    }

    if (this.where)
      base = base.where(this.where)

    const selectDate = ch.formatDateTimeSelect({
      interval,
      timeField,
      timeZone,
    })
    const dbQuery = base
      .select<DataPointChart[]>(
        db.raw(`${selectDate} as date, ${this.selectors.join(', ')}`),
      )
      .groupByRaw('date WITH ROLLUP')
      .orderBy('date')

    const sql = dbQuery.toQuery()

    const { data: r } = await ch.clickHouseSelect<DataPointChart[]>(dbQuery)

    const result = fillData<DataPointChart>({
      ...params,
      data: r,
      withRollup: true,
    })

    this.log.info(`time: ${performance.now() - p1}`)
    return { main: result, sql }
  }

  async query(
    params: QueryParamsRefined,
  ): Promise<DataCompared<DataPointChart>> {
    const paramsCompare = {
      ...params,
      timeEndAt: params.compareEndAt,
      timeStartAt: params.compareStartAt,
    }

    const qs: DataCompared<DataPointChart>[] = await Promise.all([
      this.chartQuery(params),
      this.chartQuery(paramsCompare),
    ])

    const [{ main, sql }, { main: compare }] = qs

    const mainTotals = main.shift()
    const compareTotals = compare.shift()

    return { main, mainTotals, compare, compareTotals, sql }
  }
}

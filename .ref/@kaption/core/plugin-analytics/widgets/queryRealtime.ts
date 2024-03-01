import type {
  DataCompared,
  QueryParamsRefined,
  QueryWidgetOptions,
} from '@factor/api/plugin-dashboards'
import {
  QueryWidget,
} from '@factor/api/plugin-dashboards'

export interface DataActiveUser {
  views: string
  uniqueVisitors: string
  goals: string[]
  conversions: string[]
  value: number
  date: string
}

export class QueryWidgetActiveUser extends QueryWidget {
  widget = this.settings.widget
  constructor(options: QueryWidgetOptions) {
    super({ isRealtime: true, ...options })
  }

  async query(
    params: QueryParamsRefined,
  ): Promise<DataCompared<DataActiveUser>> {
    const ch = this.kaptionClickHouse

    if (!ch)
      throw new Error('no clickhouse service')

    const sql = ch.client()

    const hourQuery = {
      ...params,
      timeEndAt: this.utils.dayjs(),
      timeStartAt: this.utils.dayjs().subtract(60, 'minute'),
    }

    const _tenMinuteQuery = {
      ...params,
      timeEndAt: this.utils.dayjs(),
      timeStartAt: this.utils.dayjs().subtract(10, 'minute'),
    }

    const selectDate = `formatDateTime(toStartOfMinute(timestamp), '%FT%T.000Z', 'UTC')`
    const select = [
      `${selectDate} as date`,
      `uniq(anonymousId) as uniqueVisitors`,
      `countIf(event='view') as views`,
      `countIf(conversion='goal') as goals`,
      `countIf(conversion='conversion') as conversions`,
      `sum(value) as value`,
    ]

    const chartQuery = ch
      .clickhouseDateQuery({ params: hourQuery })
      .select(sql.raw(select.join(',')))
      .groupByRaw('date WITH ROLLUP')
      .orderBy('date')

    const activeQuery = ch
      .clickhouseDateQuery({ params: hourQuery })
      .select(sql.raw(select.join(',')))
      .groupByRaw('date WITH ROLLUP')
      .orderBy('date')

    const [{ data: r }, { data: tTotal }] = await Promise.all([
      ch.clickHouseSelect<DataActiveUser[]>(chartQuery),
      ch.clickHouseSelect<DataActiveUser[]>(activeQuery),
    ])

    const main = r
    const mainTotals = main.shift()

    const compare = tTotal
    const compareTotals = compare.shift()

    return { main, mainTotals, compare, compareTotals }
  }
}

export class QueryVisitorLocation extends QueryWidget {
  widget = this.settings.widget
  constructor(options: QueryWidgetOptions) {
    super(options)
  }

  async query(
    params: QueryParamsRefined,
  ): Promise<DataCompared<DataActiveUser>> {
    const ch = this.kaptionClickHouse

    if (!ch)
      throw new Error('no clickhouse service')

    const sql = ch.client()

    const select = [
      'latitude',
      'longitude',
      'cityName',
      'countryCode',
      'locale',
      'timezone',
      'referralSource',
      'deviceType',
    ]

    const chartQuery = ch
      .clickhouseDateQuery({ params })
      .select(sql.raw(select.join(',')))
      .where({ event: 'init' })
      .limit(1000)

    const [response] = await Promise.all([
      ch.clickHouseSelect<DataActiveUser[]>(chartQuery),
    ])

    return {
      main: response.data,
      title: `${this.widget?.title.value} - ${response.rows} visitors`,
    }
  }
}

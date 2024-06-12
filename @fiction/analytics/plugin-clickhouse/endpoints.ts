import type { EndpointMeta, EndpointResponse, FictionEnv } from '@fiction/core'
import { Query, abort } from '@fiction/core'
import type { Knex } from 'knex'
import type { AggregationRow, QueryParams } from '../types.js'
import type { EventParams } from '../plugin-beacon/index.js'
import { refineParams } from '../utils/refine.js'
import type { FictionClickHouse } from './index.js'

interface SaveMediaSettings {
  fictionEnv: FictionEnv
  fictionClickHouse: FictionClickHouse
}

abstract class ClickHouseEndpoint extends Query<SaveMediaSettings> {
  ch = () => {
    const ch = this.settings.fictionClickHouse
    if (!ch)
      throw new Error('fictionClickHouse missing')

    return ch
  }

  constructor(settings: SaveMediaSettings) {
    super(settings)
  }
}

export class QueryGetClientSessions extends ClickHouseEndpoint {
  async run(params: { anonymousId: string, orgId: string, limit?: number }, _meta: EndpointMeta): Promise<EndpointResponse<EventParams[]>> {
    const { anonymousId, orgId, limit = 10 } = params

    const query = this.ch().clickhouseBaseQuerySession({ orgId }).where({ anonymousId }).limit(limit)

    const { data } = await this.ch().clickHouseSelect<EventParams[]>(query)

    return { status: 'success', data }
  }
}

export class QueryGetTotalSessions extends ClickHouseEndpoint {
  async run(params: { anonymousId: string, orgId: string }, _meta: EndpointMeta): Promise<EndpointResponse<number>> {
    const { anonymousId, orgId } = params
    const query = this.ch()
      .clickhouseBaseQuery({ orgId })
      .select(this.ch().client().raw('count(sessionId) as total'))
      .where({ anonymousId })
      .groupBy('anonymousId')

    const { data } = await this.ch().clickHouseSelect<{ total: number }[]>(query)

    const total = data[0]?.total || 0

    return { status: 'success', data: total }
  }
}

export class QueryGetDimensionList extends ClickHouseEndpoint {
  async run(params: QueryParams): Promise<EndpointResponse<AggregationRow[]>> {
    const client = this.ch().client()
    const refined = refineParams(params)
    const { limit = 40, dimension, search } = refined

    if (!dimension)
      throw abort('no dimension field provided')

    const base: Knex.QueryBuilder = this.ch().clickhouseDateQuery({ params: refined })

    const select = [
      client.raw(`uniq(*) as count`),
      client.raw(`?? as name`, [dimension]),
    ]

    const dbQuery = base
      .select(select)
      .groupBy(dimension)
      .orderBy('count', 'desc')
      .whereNot({ [dimension]: '' })
      .limit(limit)

    if (search) {
      void dbQuery.whereRaw(
        client.raw(`?? like '%?%'`, [dimension, search]),
      )
    }

    const { data: r } = await this.ch().clickHouseSelect<AggregationRow[]>(dbQuery)

    return { status: 'success', data: r }
  }
}

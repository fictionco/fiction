export interface QueryWidgetOptions {
  title?: string
  description?: string
  isRealtime?: boolean
  groupBy?: string
  where?: Record<string, string | number>
  table?: 'event' | 'eventSession'
  key?: string
  noCache?: boolean
  widget?: Widget
  params?: QueryParams
  selectors?: string[]
}

export abstract class QueryWidget<
  T extends QueryWidgetOptions = QueryWidgetOptions,
> extends Query<T> {
  title = this.settings.title
  description = this.settings.description
  table? = this.settings.table || 'event'
  where? = this.settings.where
  groupBy? = this.settings.groupBy
  selectors: string[] = []
  params?: QueryParamsRefined
  key? = this.settings.key || this.utils.shortId()
  noCache = true
  widget = this.settings.widget
  constructor(settings: T) {
    super(settings)
  }

  toJSON() {
    const inst = omit(
      this,
      'toJSON',
      'utils',
      'stop',
      'log',
      // "factorApp",
      // "factorRouter",
      // "factorDb",
      // "factorServer",
      // "factorEmail",
      // "factorUser",
      // "factorStripe",
      // "kaptionCache",
      // "kaptionClickHouse",
      // "factorAws",
      // "factorAdmin",
      // "kaptionDashboard",
    )

    return inst
  }

  public updateParams(params: Partial<QueryParamsRefined>): QueryParamsRefined {
    const rawParams = { ...this.params, ...params } as QueryParams

    this.params = refineParams(rawParams)

    return this.params
  }

  public selectorsAdd(selectors: string[]): this {
    this.selectors.push(...selectors)
    return this
  }

  abstract query(params: QueryParamsRefined): Promise<unknown>

  async runMapQuery<T>(params?: QueryParamsRefined): Promise<DataCompared<T>> {
    if (!params)
      throw new Error('no params in query')

    const result = (await this.query(params)) as DataCompared<T>

    return result
  }

  async run<T = unknown>(params: {
    hashIds: string[]
  }): Promise<EndpointResponse<WidgetRequestResponse<T>>> {
    const { hashIds } = params
    try {
      const result = await this.runMapQuery<T>(this.params)

      return { status: 'success', data: { result, hashIds } }
    }
    catch (error: unknown) {
      const { message, data, stack, expose, code } = error as ErrorConfig
      const params = this.params
      this.log.error(message, { data: { data, params, stack } })

      return {
        status: 'error',
        data: { hashIds, result: { main: [] } },
        message: expose ? message : '',
        code,
        error,
      }
    }
  }
}

import type {
  FactorPluginSettings,
  FactorRouter,
  dayjs,
  vueRouter,
} from '@factor/api'
import {
  FactorPlugin,
  vue,
} from '@factor/api'

import type { FactorAdmin } from '@factor/api/plugin-admin'
import type { EventParams } from '../plugin-beacon'
import type {
  ComparePeriods,
  QueryParams,
  RangeValue,
  TimeLineInterval,
} from '../../../@factor/api/plugin-dashboards/types'

type KaptionFilterSettings = {
  factorAdmin: FactorAdmin
  factorRouter: FactorRouter
} & FactorPluginSettings

export class KaptionFilter extends FactorPlugin<KaptionFilterSettings> {
  router: vueRouter.Router
  factorAdmin: FactorAdmin
  factorRouter: FactorRouter
  activeDimensions = vue.computed<
    { name: string, value: string, custom?: boolean }[]
  >(() => {
    return [
      { name: 'Page', value: 'pathname' },
      { name: 'Origin', value: 'origin' },
      { name: 'Browser', value: 'browser' },
      { name: 'OS', value: 'os' },
      { name: 'Device', value: 'deviceType' },
      { name: 'Country', value: 'countryCode' },
      { name: 'Referrer', value: 'referrer' },
      { name: 'Referral Source', value: 'referralSource' },
      { name: 'Referral Campaign', value: 'referralCampaign' },
      { name: 'Referral Medium', value: 'referralMedium' },
      { name: 'Language', value: 'locale' },
      { name: 'Timezone', value: 'timezone' },
      { name: 'City', value: 'cityName' },
      { name: 'Event Name', value: 'event' },
      { name: 'Event Category', value: 'category' },
      { name: 'Event Action', value: 'action' },
      { name: 'Event Label', value: 'label' },
    ]
  },
  )

  activeSelectedDimension = vue.computed<{
    name?: string
    value?: string
  }>(() => {
    const route = this.router.currentRoute.value
    const queryDimension = (route.query.dimension as string) || 'cityName'

    return (
      this.activeDimensions.value.find(_ => _.value === queryDimension) ?? {}
    )
  })

  activeFilters = vue.computed(() => {
    const r = this.router
    const route = r.currentRoute.value
    const q = route.query

    const filters = Object.keys(q)
      .filter(key => key.includes('f.'))
      .map((key) => {
        const rawName = key.split('.')[1]
        const hasOperator
          = rawName.charAt(rawName.length - 1) === '!'
        const filterName = hasOperator ? rawName.slice(0, -1) : rawName
        const operator: '!=' | '=' = hasOperator ? '!=' : '='
        const value = q[key] as string
        return {
          name: filterName as keyof EventParams,
          value: decodeURIComponent(value),
          operator,
        }
      })

    return filters
  })

  activeRequest = vue.computed<QueryParams>(() => {
    const route = this.router.currentRoute.value

    const interval = this.activeInterval.value
    const windowInterval = interval === 'month' ? 'month' : 'day'
    const args: QueryParams = {}

    /**
     * remove timezone information so local date/time
     * will be converted to utc on the request
     */

    args.projectId = this.factorAdmin.activeProject.value?.projectId
    args.interval = interval
    args.compare = this.activeCompare.value
    args.filters = this.activeFilters.value
    args.dimension = route.query.dimension as keyof EventParams
    args.id = route.query.id as string | undefined
    args.page = (+(route.query.page as string) || 1) as number
    args.noCache = true
    args.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    args.orderBy = route.query.orderBy as string | undefined
    args.order = route.query.order as 'asc' | 'desc' | undefined

    args.timeStartAtIso = this.utils
      .dayjs(this.activeStartTime.value)
      .startOf(windowInterval)
      .toISOString()
    args.timeEndAtIso = this.utils
      .dayjs(this.activeEndTime.value)
      .endOf(windowInterval)
      .toISOString()

    return args
  })

  filterLink = (
    name?: string | number,
    groupBy?: string,
    operator: '=' | '!=' = '=',
  ): vueRouter.RouteLocationRaw => {
    const r = this.router
    const route = r.currentRoute.value
    const groupByOperator = operator === '!=' ? '!' : ''
    const key = `f.${groupBy}${groupByOperator}`
    return { query: { ...route.query, [key]: encodeURIComponent(name || '') } }
  }

  /**
   * Remove query args that change when other filters change
   */
  resetSpecificParams = async (
    v: QueryParams,
    old?: QueryParams,
  ): Promise<void> => {
    // reset page number on changes to query criteria
    if (v.page && v.page > 1 && v.page === old?.page) {
      const router = this.router
      const q = router.currentRoute.value.query
      await router.replace({ query: { ...q, page: 1 } })
    }
  }

  constructor(settings: KaptionFilterSettings) {
    super('dashboard', settings)

    this.factorAdmin = settings.factorAdmin
    this.factorRouter = settings.factorRouter
    this.router = this.factorRouter.router
  }

  setup() {}

  naiveIsoString = (dateTime: dayjs.Dayjs): string => {
    return dateTime.format('YYYY-MM-DD')
  }

  activeCompare = vue.computed<ComparePeriods>(() => {
    const route = this.factorRouter.router.currentRoute.value
    const compare = route.query.compare as ComparePeriods

    return compare ?? 'period'
  })

  activeEndTime = vue.computed<string>(() => {
    const route = this.factorRouter.router.currentRoute.value
    const toQ = route.query.to as string
    const startOfDay = this.utils.dayjs().local().startOf('day')
    const endTime = toQ || this.naiveIsoString(startOfDay)

    return endTime
  })

  activeStartTime = vue.computed<string>(() => {
    const route = this.factorRouter.router.currentRoute.value
    const fromQ = route.query.from as string
    const startTime
      = fromQ
      || this.naiveIsoString(
        this.utils.dayjs(this.activeEndTime.value).subtract(7, 'day'),
      )
    return startTime
  })

  activeInterval = vue.computed<TimeLineInterval>(() => {
    const interval = this.factorRouter.query.value.interval as TimeLineInterval

    const end = this.utils.dayjs(this.activeEndTime.value)
    const start = this.utils.dayjs(this.activeStartTime.value)

    const sliceInterval
      = interval || (end.diff(start, 'day') > 4 ? 'day' : 'hour')

    return sliceInterval
  })

  compareDateRangeList = (): RangeValue<ComparePeriods>[] => {
    const end = this.utils.dayjs(this.activeEndTime.value)
    const start = this.utils.dayjs(this.activeStartTime.value)
    const diff = end.diff(start, 'day') + 1

    return [
      {
        name: 'period',
        timeStartAt: start.subtract(diff, 'day'),
        timeEndAt: end.subtract(diff, 'day'),
        value: 'period',
      },
      {
        name: 'week',
        timeStartAt: start.subtract(1, 'week'),
        timeEndAt: end.subtract(1, 'week'),
        value: 'week',
      },
      {
        name: 'month',
        timeStartAt: start.subtract(1, 'month'),
        timeEndAt: end.subtract(1, 'month'),
        value: 'month',
      },
      {
        name: 'quarter',
        timeStartAt: start.subtract(3, 'month'),
        timeEndAt: end.subtract(3, 'month'),
        value: 'quarter',
      },
      {
        name: 'year',
        timeStartAt: start.subtract(1, 'year'),
        timeEndAt: end.subtract(1, 'year'),
        value: 'year',
      },
    ]
  }

  activeCompareRange = vue.computed((): RangeValue<string> => {
    const ranges = this.compareDateRangeList()
    return ranges.find(_ => _.value === this.activeCompare.value) ?? ranges[0]
  })

  getCurrentDateIndex = <T extends { date: string }>(data: T[]): number => {
    const interval = this.activeInterval.value

    return data.findIndex((_) => {
      const dateItem = this.utils.dayjs(_.date).utc()
      const presentIndex = this.utils.dayjs()

      return (
        dateItem.isSame(presentIndex, interval)
        || dateItem.isAfter(presentIndex, interval)
      )
    })
  }

  /**
   * Refines and adjusts raw data from the API
   * Fills in empty dates, etc.
   */
  intervalDataPoints = <T extends { date: string }>(args: {
    timeStartAt?: dayjs.Dayjs
    timeEndAt?: dayjs.Dayjs
    interval?: TimeLineInterval
    windowInterval?: TimeLineInterval
    compare?: boolean
    data: T[]
  }): T[] => {
    const comp = this.activeCompareRange.value

    const { compare, interval = this.activeInterval.value } = args

    const {
      timeStartAt = compare
        ? comp.timeStartAt
        : this.utils.dayjs(this.activeStartTime.value),
      timeEndAt = compare
        ? comp.timeEndAt
        : this.utils.dayjs(this.activeEndTime.value),
      windowInterval = interval === 'hour' ? 'day' : interval,
      data,
    } = args
    const newData: { date: string, [key: string]: any }[] = []

    let loopTime: dayjs.Dayjs
    let finishTime: dayjs.Dayjs

    if (interval === 'hour' || interval === 'day') {
      loopTime = timeStartAt.tz().startOf(windowInterval).utc()
      finishTime = timeEndAt.tz().endOf(windowInterval).utc()
    }
    else {
      loopTime = timeStartAt.utc().startOf(interval)
      finishTime = timeEndAt.utc().endOf(interval).add(1, interval)
    }

    while (loopTime.isBefore(finishTime, interval)) {
      const date = loopTime.toISOString()

      const found = data.find(_ => _.date === date)

      newData.push({ date, ...found })

      loopTime = loopTime.add(1, interval)
    }

    return newData as T[]
  }

  activeDateFormat = vue.computed(() => {
    const interval = this.activeInterval.value
    const out = []

    if (interval === 'hour')
      out.push('M/D ha')
    else
      out.push('MMM DD')

    return out.join(', ')
  })

  dateRangeList = (): {
    name: string
    timeStartAt: string
    timeEndAt: string
    value: string
  }[] => {
    const today = this.utils.dayjs().local().startOf('day')

    const dates = {
      today,
      yesterday: today.subtract(1, 'day'),
      recent: today.subtract(3, 'day'),
      week: today.subtract(7, 'day'),
      month: today.subtract(28, 'day'),
      quarter: today.subtract(3, 'month'),
      year: today.subtract(365, 'day'),
      yearToDate: today.startOf('year'),
    }

    const ranges = [
      {
        name: 'Today',
        value: 'today',
        timeStartAt: this.naiveIsoString(dates.today),
      },
      {
        name: 'Yesterday',
        value: 'yesterday',
        timeEndAt: this.naiveIsoString(dates.yesterday),
        timeStartAt: this.naiveIsoString(dates.yesterday),
      },
      {
        name: 'Last 3 Days',
        value: 'recent',
        timeStartAt: this.naiveIsoString(dates.recent),
      },
      {
        name: 'Last 7 Days',
        value: 'week',
        timeStartAt: this.naiveIsoString(dates.week),
      },
      {
        name: 'Last Month',
        value: 'month',
        timeStartAt: this.naiveIsoString(dates.month),
      },
      {
        name: 'Last Quarter',
        value: 'quarter',
        timeStartAt: this.naiveIsoString(dates.quarter),
      },
      {
        name: 'Last Year',
        value: 'year',
        timeStartAt: this.naiveIsoString(dates.year),
      },
      {
        name: 'Month to date',
        value: 'monthToDate',
        timeStartAt: this.naiveIsoString(today.startOf('month')),
      },
      {
        name: 'Year to date',
        value: 'yearToDate',
        timeStartAt: this.naiveIsoString(today.startOf('year')),
      },
    ]

    const r = ranges.map((r) => {
      return { timeEndAt: this.naiveIsoString(dates.today), ...r }
    })

    return r
  }

  intervalList = (): Partial<RangeValue<TimeLineInterval>>[] => {
    return [
      {
        name: 'Hour',
        value: 'hour',
      },
      {
        name: 'Day',
        value: 'day',
      },
      {
        name: 'Week',
        value: 'week',
      },
      {
        name: 'Month',
        value: 'month',
      },
    ]
  }
}

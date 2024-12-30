import type { DataCompared, DataPointChart, QueryParamsRefined, TimeLineInterval } from '@fiction/analytics/types'
import { refineParams } from '@fiction/analytics/utils/refine'
import dayjs from 'dayjs'

const metricKeys = ['count', 'users'] as const
type SimDataPoint = DataPointChart<typeof metricKeys[number]>

class TimeSeriesGenerator {
  constructor(private args: {
    days: number
    baseValue: number
    volatility: number
    trend: number
  }) {}

  private generatePoints(): SimDataPoint[] {
    const { days } = this.args
    const now = dayjs()
    const startDate = now.subtract(days, 'day')

    return Array.from({ length: days }, (_, i) => {
      const value = this.calculateValue(i)
      return {
        date: startDate.add(i, 'day').toISOString(),
        count: value,
        users: Math.round(value * 0.7), // Simulate related metric
        tense: this.getTense(i),
      }
    })
  }

  private calculateValue(day: number): number {
    const { baseValue, volatility, trend } = this.args
    const trendFactor = 1 + trend * day
    const randomFactor = 1 + (Math.random() - 0.5) * volatility
    return Math.max(0, Math.round(baseValue * trendFactor * randomFactor))
  }

  private getTense(day: number): 'past' | 'present' | 'future' {
    const daysFromEnd = this.args.days - day - 1
    return daysFromEnd > 2 ? 'past' : daysFromEnd === 2 ? 'present' : 'future'
  }

  private calculateTotals(data: SimDataPoint[]): SimDataPoint {
    return data.reduce((totals, point) => ({
      date: '',
      count: Number(totals.count || 0) + Number(point.count || 0),
      users: Number(totals.users || 0) + Number(point.users || 0),
    }), { date: '', count: 0, users: 0 } as SimDataPoint)
  }

  generate(): DataCompared<SimDataPoint> {
    const main = this.generatePoints()

    // Ensure we have required params for QueryParamsRefined
    const params = refineParams({
      interval: 'day' as TimeLineInterval,
      timeStartAtIso: dayjs().subtract(this.args.days, 'day').toISOString(),
      timeEndAtIso: dayjs().toISOString(),
    })

    return {
      main,
      mainTotals: this.calculateTotals(main),
      params,
    }
  }
}

export function generateTimeSeriesData(args: {
  days: number
  baseValue: number
  volatility: number
  trend: number
}): DataCompared<SimDataPoint> {
  return new TimeSeriesGenerator(args).generate()
}

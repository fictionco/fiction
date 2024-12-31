import type { FictionUser } from '@fiction/core'
import type { DataCompared, DataPointChart, FictionAnalytics, MetricSelectorResult } from '.'
import type { MetricDisplayItem } from './types'
import { FictionObject, vue } from '@fiction/core'
import { generateTimeSeriesData } from '../plugins/plugin-onboard/widgets/utils'

type DisplayMetric = MetricDisplayItem & {
  value: number
  change: number
  data: DataCompared<DataPointChart<'value'>>
}

type GroupedMetrics = {
  primary?: DisplayMetric
  secondary: DisplayMetric[]
  detailed: DisplayMetric[]
}

export class MetricDisplayFactory extends FictionObject<{
  fictionAnalytics: FictionAnalytics
  fictionUser: FictionUser
  items: MetricDisplayItem[]
}> {
  items = this.settings.items

  // Main state
  metrics = vue.shallowRef<DisplayMetric[]>([])
  loading = vue.ref(false)
  error = vue.ref<string>()

  // Computed groupings
  grouped = vue.computed((): GroupedMetrics => {
    const metrics = this.metrics.value
    return {
      primary: metrics.find(m => m.displayFormat === 'primary'),
      secondary: metrics.filter(m => m.displayFormat === 'secondary'),
      detailed: metrics.filter(m => m.displayFormat === 'detailed'),
    }
  })

  private processMetricResult(metric: MetricDisplayItem, result: MetricSelectorResult): DisplayMetric {
    const mainTotal = Number(result.data.mainTotals?.value || 0)
    const compareTotal = Number(result.data.compareTotals?.value || 0)

    return {
      ...metric,
      value: mainTotal,
      change: compareTotal ? mainTotal - compareTotal : 0,
      data: result.data,
    }
  }

  async init() {
    try {
      this.loading.value = true

      await this.settings.fictionUser.userInitialized()

      // Get data from analytics
      const response = await this.settings.fictionAnalytics.requests.CompiledMetrics.projectRequest({
        metrics: this.items,
      })

      if (!response.data) {
        this.log.error('No data received from analytics', { data: response })
        throw new Error('No data received from analytics')
      }
      else {
        this.log.info('Received data from analytics', { data: response })
      }

      // Process results
      const metrics = this.items.map((item) => {
        const result = response.data?.find(r => r.key === item.key)
        if (!result) {
          throw new Error(`No data found for metric ${item.key}`)
        }
        return this.processMetricResult(item, result)
      })

      this.metrics.value = metrics
    }
    catch (e) {
      const error = e as Error
      this.error.value = error.message
      this.log.error('Failed to initialize metrics', { error })
    }
    finally {
      this.loading.value = false
    }
  }
}

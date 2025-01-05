import type { FictionUser } from '@fiction/core'
import type { FictionAnalytics, MetricDisplayItemWithData, MetricSelectorResult } from '.'
import type { MetricDisplayItem } from './types'
import { FictionObject, vue } from '@fiction/core'

type GroupedMetrics = {
  primary?: MetricDisplayItemWithData[]
  secondary: MetricDisplayItemWithData[]
  detailed: MetricDisplayItemWithData[]
}

export class MetricDisplayFactory extends FictionObject<{
  fictionAnalytics: FictionAnalytics
  fictionUser: FictionUser
  items: MetricDisplayItem[]
}> {
  items = this.settings.items

  // Main state
  metrics = vue.shallowRef<MetricDisplayItemWithData[]>([])
  loading = vue.ref(false)
  error = vue.ref<string>()

  hovered = vue.ref<MetricDisplayItemWithData>()

  // Computed groupings
  grouped = vue.computed((): GroupedMetrics => {
    const metrics = this.metrics.value
    const h = this.hovered.value

    // Map metrics to include hover state
    const mappedMetrics = h
      ? metrics.map((m) => {
          // If this metric matches the currently hovered one, return hovered version
          if (h?.key === m.key) {
            return h
          }
          return m
        })
      : metrics

    return {
      primary: mappedMetrics.filter(m => m.displayFormat === 'primary'),
      secondary: mappedMetrics.filter(m => m.displayFormat === 'secondary'),
      detailed: mappedMetrics.filter(m => m.displayFormat === 'detailed'),
    }
  })

  private processMetricResult(metric: MetricDisplayItem, result: MetricSelectorResult): MetricDisplayItemWithData {
    const mainTotal = Number(result.data.mainTotals?.value || 0)
    const compareTotal = Number(result.data.compareTotals?.value || 0)

    return {
      ...metric,
      value: mainTotal,
      change: mainTotal - compareTotal,
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

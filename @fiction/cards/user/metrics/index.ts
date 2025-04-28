import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card.js'

const templateId = 'cardMetricsV1'

export const template = cardTemplate({
  templateId,
  tags: ['stats'],
  frequency: 'standard',
  title: 'Metrics',
  description: 'Transform raw numbers into compelling stories that showcase your brand\'s success. Features animated counters, customizable styling, and multiple display formats to help visitors instantly grasp your achievements.',
  subTitle: 'Visualize key performance metrics that build trust and credibility',
  icon: 'i-tabler-chart-dots',
  colorTheme: 'emerald',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElMetrics.vue')),

  async getConfig(args) {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
  screenshot: {
    light: new URL('img/screen-light.svg', import.meta.url).href,
    dark: new URL('img/screen-dark.svg', import.meta.url).href,
  },
})

export type { MetricItem, UserConfig } from './config'

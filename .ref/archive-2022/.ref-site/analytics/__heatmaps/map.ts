import type { Component } from 'vue'
import { defineAsyncComponent as def } from 'vue'
import { mapTypeHelper } from '../../util'
import heatmapsScreenshot from './img/screenHeatmaps.webp'
import thumbHeatmaps from './img/thumbHeatmaps.webp'

export const map = mapTypeHelper({
  heatmaps: {
    header: 'full',
    class: 'text-red-500',
    bgClass: 'text-red-50',
    icon: `<svg viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path d="M1.63819 12.7433C2.03129 12.6731 2.43418 12.5221 2.86393 12.3846C3.50614 12.1791 4.14822 11.9462 4.74101 11.7964C4.8881 11.7593 5.04194 11.762 5.18939 11.7977L9.09204 12.7434C9.74536 12.8864 10.3932 12.6163 11.1173 12.3846C11.5645 12.2415 12.0115 12.0852 12.4419 11.9528C12.8911 11.8147 13.2187 11.4085 13.2187 10.9386V2.58094C13.2187 2.11103 12.8855 1.70698 12.4174 1.74757C11.8969 1.79269 11.3403 1.92721 10.9436 2.02964C10.4706 2.15176 9.92689 2.40431 9.39833 2.64088C9.19999 2.72965 8.97781 2.74844 8.76663 2.69726L4.96532 1.77612C4.312 1.63314 3.30748 1.87025 2.69014 2.02964C2.30452 2.12921 1.87187 2.31548 1.43874 2.50911C1.07473 2.67183 0.838623 3.03423 0.838623 3.43296V11.9386C0.838623 12.4085 1.1756 12.8259 1.63819 12.7433Z" fill="" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path><path d="M9.08524 12.7417L5.18937 11.7977C5.11574 11.7798 5.04052 11.7702 4.96533 11.7697V1.90305C4.96533 1.86088 4.96795 1.81912 4.97307 1.778L8.76661 2.69726C8.87377 2.72323 8.98376 2.73118 9.09203 2.72112V12.6239C9.09203 12.6635 9.08973 12.7029 9.08524 12.7417Z" fill="" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path></g></svg>`,
    path: '/platform/heatmaps',
    name: 'Live Heatmaps',
    tagline: 'Visualize user behavior',
    description:
      'View the interaction heatmap across your website in real time. See how elements change people\'s behavior.',
    screenshot: heatmapsScreenshot,
    thumb: thumbHeatmaps,
    category: 'Analytics',
    aspects: [
      {
        align: 'wide',
        tagline: 'On-Demand Live Heatmaps',

        name: `Data meets context.`,
        description: `Bring together the qualitative and quantitative. Use heatmaps to add context and meaning to your data.`,
        figure: def<Component>(() => import('./HeatmapFigure.vue')),
      },
      {
        align: 'wide',
        tagline: 'Filter and Control Heatmap Data',
        name: 'Custom Heatmaps in Realtime',
        description: `Use analytics filters, date controls and other tools to visualize how different segments of traffic behave over time.`,
        figure: def<Component>(() => import('./HeatmapRealtime.vue')),
      },
    ],
  },
})

import { defineAsyncComponent as def } from 'vue'
import { mapTypeHelper } from '../../util'
import conversionScreenshot from './img/screenConversion.webp'
import thumbConversion from './img/thumbConversion.webp'

export const map = mapTypeHelper({
  conversion: {
    header: 'full',
    class: 'text-blue-600',
    bgClass: 'bg-blue-100',
    icon: `<svg viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path d="M3.059 9.12342C4.32337 9.23411 5.64301 9.37262 7.00004 9.37262C8.35707 9.37262 9.6767 9.23412 10.9411 9.12342C11.4642 9.07763 11.8703 8.64163 11.8703 8.1165V2.43945C11.8703 1.91432 11.4642 1.47832 10.9411 1.43253C9.6767 1.32184 8.35707 1.18333 7.00004 1.18333C5.64301 1.18333 4.32337 1.32184 3.059 1.43253C2.53588 1.47832 2.12976 1.91432 2.12976 2.43945V8.1165C2.12976 8.64163 2.53588 9.07763 3.059 9.12342Z" fill="" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path><path d="M2.12976 12.8167L2.12976 3.09561" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>`,
    path: '/platform/conversion',
    name: 'Conversion Tracking',
    tagline: 'Measure custom data',
    description:
      'Easily create events and goals to track and visualize macro and micro conversions',
    screenshot: conversionScreenshot,
    thumb: thumbConversion,
    category: 'Analytics',
    aspects: [
      {
        align: 'wide',
        tagline: 'Real time conversion measurement',
        name: 'Turn conversion into a science',
        description: `Fully quantify your customer acquisition costs with advanced, yet simple, conversion measurement tools.`,
        figure: def(() => import('./AnalyticsConversionTools.vue')),
      },
      {
        align: 'wide',
        tagline: 'Light-weight testing and results',
        name: 'Macro vs Micro',
        description: `Break goals into macro or micro conversions and weight your results accordingly. Create a formula for your traffic investments.`,
        figure: def(() => import('./AnalyticsConversionMicroMacro.vue')),
      },
    ],
  },
})

import Perfume from 'perfume.js'

interface PageVitals {
  vitalCLS?: number
  vitalFID?: number
  vitalLCP?: number
  vitalTBT?: number
}

let __pageVitals: Partial<PageVitals> = {}
export function pageVitals(action?: 'start'): Partial<PageVitals> {
  if (typeof window === 'undefined')
    return {}

  if (action === 'start') {
    __pageVitals = {}
    new Perfume({
      analyticsTracker: (options): void => {
        const { metricName, data } = options
        if (typeof data === 'number') {
          if (metricName === 'lcp' && data > 0)
            __pageVitals.vitalLCP = Math.round(data)
          else if (metricName === 'fid' && data > 0)
            __pageVitals.vitalFID = Math.round(data)
          else if (metricName === 'cls' && data > 0)
            __pageVitals.vitalCLS = data
          else if (metricName === 'tbt' && data > 0)
            __pageVitals.vitalTBT = Math.round(data)
        }
      },
    })
  }

  return __pageVitals
}

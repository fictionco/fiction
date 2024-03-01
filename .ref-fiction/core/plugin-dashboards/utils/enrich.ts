import { capitalize, displayDomain } from '@factor/api'

import type { AggregationFormat, AggregationRow } from '../types'
import { getCountryName } from './enrichCountry'
import { getDataIcon } from './enrichIcon'

export function enrichData(args: {
  data?: AggregationRow[]
  aggregationFormat?: AggregationFormat
  widgetKey?: string
}): AggregationRow[] {
  const { data = [], aggregationFormat = 'standard', widgetKey } = args

  return data.map((item) => {
    if (aggregationFormat === 'country') {
      item.niceName = getCountryName(item.name)
      item.countryCode = item.name.toLowerCase()
    }
    else if (aggregationFormat === 'city') {
      item.countryCode = item.countryCode?.toLowerCase() || ''
    }
    else if (aggregationFormat === 'ip') {
      item.niceName = item.name.replace(`::ffff:`, '')
    }
    else {
      const name = decodeURI(item.name)

      item.niceName = capitalize(displayDomain(name))
    }

    if (item.url && Array.isArray(item.url))
      item.url = item.url[0]

    if (
      (aggregationFormat === 'enriched' || aggregationFormat === 'url')
      && widgetKey
    ) {
      item.icon = getDataIcon({
        dictionaryMatch: item.name,
        widgetKey,
        item,
      })
    }

    return item
  })
}

import type { TargetingList } from '../types'

const targetingConfig: TargetingList[] = [
  {
    value: 'behavior',
    name: 'Pages and Behavior',
    desc: 'Filter by pages visited, behavior',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
</svg>`,
    list: [
      {
        value: 'pathname',
        name: 'Visited Page',
        desc: 'Filter by visitors who visited a specific page',
      },
    ],
  },

  {
    value: 'utm',
    name: 'Referrer and UTM',
    desc: 'Based on referrer or the url/utm parameter.',
    list: [
      {
        value: 'referrer',
        name: 'Referrer URL',
        desc: 'Filter by referring URL',
      },
      {
        value: 'referralCampaign',
        name: 'Campaign',
        desc: 'UTM campaign',
      },
      {
        value: 'referralMedium',
        name: 'Medium',
        desc: 'UTM medium',
      },
      {
        value: 'referralSource',
        name: 'Source',
        desc: 'UTM source',
      },
    ],
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
</svg>`,
  },

  {
    value: 'geography',
    name: 'Geography',
    desc: 'Specific city, metro, region or county.',
    list: [
      {
        value: 'cityName',
        name: 'City',
        desc: 'Visitor city',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
</svg>`,
      },
      {
        value: 'countryCode',
        name: 'Country',
        desc: 'Visitor country code',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>`,
      },
    ],
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
</svg>`,
  },
  {
    value: 'technology',
    name: 'Technology',
    desc: 'Specific device, browser or OS.',
    list: [
      {
        value: 'os',
        name: 'OS',
        desc: 'Visitor operating system',
      },
      {
        value: 'browser',
        name: 'Browser',
        desc: 'Visitor browser',
      },
      {
        value: 'deviceType',
        name: 'Device Type',
        desc: 'Mobile, tablet, or desktop devices.',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
</svg>`,
      },
    ],
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
</svg>`,
  },
  {
    value: 'eventData',
    name: 'Event Data',
    desc: 'Based on event name, label, action or category.',
    list: [
      {
        value: 'event',
        name: 'Event Name',
      },
      {
        value: 'category',
        name: 'Event Category',
      },
      {
        value: 'label',
        name: 'Event Label',
      },
      {
        value: 'action',
        name: 'Event Action',
      },
    ],
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
</svg>`,
  },
]

export function getTargetingConfig(categoryList: string[]): TargetingList<'geography' | 'technology' | 'referrer' | 'session'>[] {
  return categoryList
    .map((_) => {
      return targetingConfig.find(item => item.value === _)
    })
    .filter(Boolean) as TargetingList<
      'geography' | 'technology' | 'referrer' | 'session'
  >[]
}

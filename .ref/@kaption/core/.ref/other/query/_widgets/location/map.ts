import { mapTypeHelper } from '../helpers'

export const map = mapTypeHelper({
  globeVisitors: {
    title: 'Visitor Location',
    description:
      'A map showing the location of the visitors within a period of time.',
    table: 'event',
    queryFormat: 'list',
    where: { eventName: 'init' },
    selector: [
      'latitude',
      'longitude',
      'city',
      'countryCode',
      'language',
      'timezone',
      'referralSource',
      'deviceType',
    ],
    ui: 'GlobeChart',
    colSpan: 9,
    rowSpan: 2,
    limit: 1200,
    custom: true,
    icon: `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`,
  },
})

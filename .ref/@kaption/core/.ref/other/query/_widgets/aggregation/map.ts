import { mapTypeHelper } from '../helpers'

export const map = mapTypeHelper({
  topBrowsers: {
    title: 'Top Browsers',
    description: 'List of top visitor browsers',
    aggregationFormat: 'enriched',
    table: 'event',
    groupBy: 'browser',
    queryFormat: 'aggregation',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>`,
    custom: true,
  },
  topCountries: {
    title: 'Top Countries',
    description: 'List of visitor countries',
    aggregationFormat: 'country',
    table: 'event',
    groupBy: 'countryCode',
    queryFormat: 'aggregation',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`,
    custom: true,
  },
  topReferrers: {
    title: 'Top Referrers',
    description: 'Top referring urls',
    aggregationFormat: 'enriched',
    table: 'event',
    groupBy: 'referrer',
    selector: ['referrer as url'],
    queryFormat: 'aggregation',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
  </svg>`,
    custom: true,
  },
  topSources: {
    title: 'Top Referral Sources',
    description: 'List of most commonly seen referral sources (ref/utm_source)',
    aggregationFormat: 'standard',
    table: 'event',
    groupBy: 'referralSource',
    selector: ['topK(1)(referrer) as url'],
    queryFormat: 'aggregation',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>`,
    custom: true,
  },
  topMediums: {
    title: 'Top Referral Mediums',
    description: 'List of most commonly seen campaigns (medium/utm_medium)',
    aggregationFormat: 'standard',
    table: 'event',
    groupBy: 'referralMedium',
    selector: ['topK(1)(referrer) as url'],
    queryFormat: 'aggregation',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>`,
    custom: true,
  },
  topCampaigns: {
    title: 'Top Referral Campaigns',
    description: 'List of most commonly seen campaigns (campaign/utm_campaign)',
    aggregationFormat: 'standard',
    table: 'event',
    groupBy: 'referralCampaign',
    selector: ['topK(1)(referrer) as url'],
    queryFormat: 'aggregation',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>`,
    custom: true,
  },
  topPages: {
    title: 'Top Pages',
    description: 'List of most visited pages',
    aggregationFormat: 'standard',
    table: 'event',
    groupBy: 'pathname',
    where: { eventName: 'exit' },
    queryFormat: 'aggregation',
    countOn: 'count(*)',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
  </svg>`,
    custom: true,
  },
  topOperatingSystems: {
    title: 'Top Operating Systems',
    description: 'List of top operating systems',
    aggregationFormat: 'enriched',
    table: 'event',
    groupBy: 'os',
    queryFormat: 'aggregation',
  },
  topDevices: {
    title: 'Device Breakdown',
    description: 'Visitor device type breakdown',
    aggregationFormat: 'enriched',
    table: 'event',
    groupBy: 'deviceType',
    queryFormat: 'aggregation',
    rowSpan: 1,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>`,
    custom: true,
  },
  topEventName: {
    title: 'Top Events',
    description: 'List of top events',
    aggregationFormat: 'standard',
    table: 'event',
    groupBy: 'eventName',
    queryFormat: 'aggregation',
    countOn: 'count(*)',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>`,
    custom: true,
  },
  topEventCategory: {
    title: 'Top Event Categories',
    description: 'List of top categories attached to events',
    aggregationFormat: 'standard',
    table: 'event',
    groupBy: 'category',
    queryFormat: 'aggregation',
    countOn: 'count(*)',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>`,
    custom: true,
  },
  topEventAction: {
    title: 'Top Event Actions',
    description: 'List of top actions attached to events',
    aggregationFormat: 'standard',
    table: 'event',
    groupBy: 'action',
    queryFormat: 'aggregation',
    countOn: 'count(*)',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>`,
    custom: true,
  },
  topEventLabel: {
    title: 'Top Event Labels',
    description: 'List of top labels attached to events',
    aggregationFormat: 'standard',
    table: 'event',
    groupBy: 'label',
    queryFormat: 'aggregation',
    countOn: 'count(*)',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>`,
    custom: true,
  },
})

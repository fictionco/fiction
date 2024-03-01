import type { EndpointResponse, SessionFields } from '@kaption/types'
import { mapTypeHelper } from '../helpers'
import type { RequestFullAnalytics } from '../types'

export interface EndpointMap {
  singleSession: {
    request: RequestFullAnalytics
    response: EndpointResponse<Partial<SessionFields>>
  }
}

export const map = mapTypeHelper({
  totalReplays: {
    title: 'Sessions Recorded',
    description: 'Chart showing the rate and amount of recorded sessions',
    queryFormat: 'chart',
    rowSpan: 1,
    colSpan: 6,

    table: 'eventSession',
    groupBy: 'interval',
    selector: ['sum(hasReplay) as totalReplays'],
  },
  timeRecorded: {
    title: 'Total Time Recorded',
    description: 'Chart showing the rate and amount of recorded sessions',
    queryFormat: 'chart',
    rowSpan: 1,
    colSpan: 6,
    valueFormat: 'duration',
    table: 'eventSession',
    groupBy: 'interval',
    selector: ['sum(replayDuration) as timeRecorded'],
  },
  replayIndex: {
    title: 'Recorded Session Replays',
    description:
      'Watch session replays to see how users interact with your site.',
    ui: 'ReplayIndex',
    rowSpan: 4,
    colSpan: 12,
    queryFormat: 'listReplay',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`,
    custom: true,
    pro: true,
  },
})

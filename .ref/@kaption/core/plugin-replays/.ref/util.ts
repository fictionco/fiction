import type {
  EndpointResponse,
} from '@factor/api'
import {
  _stop,
  durationFormatter,
  storeItem,
  stored,
} from '@factor/api'
import type { KaptionAdmin } from '../../plugin-admin'

import type { ReplaySessionEvent } from '../types'
import { Queries } from './query'

export async function requestFullReplaySession(params: {
  replayId: string
  kaptionAdmin: KaptionAdmin
}): Promise<EndpointResponse<Partial<ReplaySessionEvent>>> {
  const { replayId, kaptionAdmin } = params
  const activeProjectId = kaptionAdmin.activeProjectId
  if (!params.replayId)
    throw _stop('replayId required')
  if (!activeProjectId.value)
    throw _stop('projectId required')

  const cacheKey = `replay:${replayId}`
  const cached = stored<Partial<ReplaySessionEvent>>(cacheKey)

  if (cached) {
    return { status: 'success', data: cached }
  }
  else {
    const r = await Queries.CompileReplay.serve(
      {
        ...params,
        projectId: activeProjectId.value,
      },
      {},
    )

    if (r.status === 'success' && r?.data?.replay)
      storeItem(cacheKey, r.data)

    return r
  }
}

export function getReplayLink(session: Partial<ReplaySessionEvent>): string {
  const { projectId, sessionId } = session
  return `/project/${projectId}/dash/replay/${sessionId}`
}

function referDomain(referrer?: string): string {
  if (!referrer)
    return ''
  const h = new URL(referrer).hostname
  return h.replace('www.', '')
}

export function getUiSessions(sessions: Partial<ReplaySessionEvent>[]): Partial<ReplaySessionEvent>[] {
  return sessions.map((s) => {
    return {
      ...s,

      replayPath: getReplayLink(s),
      shortClientId: s.anonymousId?.slice(18, s.anonymousId.length),
      shortSessionId: s.sessionId?.slice(18, s.sessionId.length),
      engageDurationFormatted: durationFormatter(s.engageDuration),
      referredBy: s.referrer ? `${referDomain(s.referrer)}` : '',
      recordingEventsCount: s.eventList?.length ?? 0,
    }
  })
}

import { dayjs } from '@factor/api'
import type { SessionEvent } from '../plugin-beacon'

export function getReplayId(args: {
  sessionId: string
  timestamp?: string | number | undefined
}): string {
  const { sessionId, timestamp } = args
  if (!timestamp)
    throw new Error('timestamp required for replayId')
  return `${dayjs(timestamp).format('YYYY-MM')}_${sessionId}`
}

export function replayFilePath(args: {
  projectId?: string
  replayId?: string
  session?: SessionEvent
}): string {
  let projectId
  let dateSlug
  let sessionId
  if (args.session) {
    const { timestamp = 0 } = args.session
    projectId = args.session.projectId
    sessionId = args.session.sessionId
    dateSlug = dayjs.unix(timestamp as number).format('YYYY-MM')
  }
  else if (args.projectId && args.replayId) {
    ;[dateSlug, sessionId] = args.replayId.split('_')
    projectId = args.projectId
  }

  return `${dateSlug}/replays/${projectId}/session-${sessionId}.json`
}

import type { ReplayEvent, SessionFields } from '@kaption/engine'
import { logger } from '@factor/api'
import dayjs from 'dayjs'
import { replayFilename, saveToS3 } from './replay'

export async function saveReplaySessionsToS3(replaySets: { session: Partial<SessionFields>, replay: ReplayEvent[] }[]): Promise<void> {
  logger.log({
    level: 'debug',
    context: 'replay',
    description: `saving ${replaySets.length} replays to s3`,
  })
  const __promises = replaySets.map(async ({ replay, session }) => {
    const { sessionId, projectId, timestamp } = session
    if (!projectId || !sessionId)
      return

    const replayId = `${dayjs(timestamp).format('YYYY-MM')}.${sessionId}`
    await saveToS3({
      fileName: replayFilename({ projectId, replayId }),
      data: JSON.stringify({ ...session, replay }),
    })
  })

  await Promise.all(__promises)
}

import {
  dailyCounter,
  getRedisConnection,
  isRecordingEligible,
  saveEvents,
  sendMessageToClient,
} from '@kaption/service'
import type IORedis from 'ioredis'
import type { ReplayComponents, ReplayEvent, SessionFields } from '@kaption/engine'
import { saveReplaySessionsToS3 } from '@kaption/plugins/replays/save'
import { logger } from '@factor/api'

let __store: IORedis.Redis

export async function getStore(): Promise<IORedis.Redis> {
  if (__store)
    return __store

  const client = getRedisConnection({ id: 'replayStore' })

  __store = client
  return client
}

export function replayCacheKey(clientId: string): string {
  return `replay:${clientId}`
}

function getReplayMetaData(replay: ReplayEvent[]): {
  startTime: number
  endTime: number
  totalTime: number
} {
  const firstEvent = replay[0]
  const lastEvent = replay[replay.length - 1]
  return {
    startTime: firstEvent.timestamp,
    endTime: lastEvent.timestamp,
    totalTime: lastEvent.timestamp - firstEvent.timestamp,
  }
}

function getReplayDuration(replay: ReplayEvent[]): number {
  const { totalTime } = getReplayMetaData(replay)

  const duration = Math.round(totalTime / 1000)

  return duration > 0 ? duration : 0
}

export async function getMemoryReplay(clientId: string): Promise<ReplayEvent[] | undefined> {
  const store = await getStore()
  const r = await store.get(replayCacheKey(clientId))

  return r ? (JSON.parse(r) as ReplayEvent[]) : undefined
}
function stopRecording(clientId: string): void {
  sendMessageToClient(clientId, {
    status: 'error',
    messageType: 'stopRecording',
  })
}
export async function updateMemoryReplay(clientId: string, replay: ReplayEvent[]): Promise<void> {
  const store = await getStore()

  const redisKey = replayCacheKey(clientId)

  const replayForStorage = JSON.stringify(replay)

  const memorySize = Buffer.byteLength(replayForStorage, 'utf-8')

  if (memorySize > 25_000_000) {
    logger.log({
      level: 'warn',
      context: 'replay',
      description: `memory size limit exceeded`,
      data: { clientId },
    })
    stopRecording(clientId)
    return
  }

  await store.set(redisKey, replayForStorage, 'EX', 60 * 120)
}

export async function expireReplay(session: SessionFields): Promise<void> {
  const { clientId, projectId } = session
  const replay = await getMemoryReplay(clientId)
  const replayFound = replay ? replay.length : '(not found)'
  logger.log({
    level: 'info',
    context: 'replay',
    description: `session expired, looking for replay: ${replayFound}`,
  })
  if (replay) {
    await saveEvents({
      projectId: session.projectId as string,
      session,
      events: [
        {
          event: 'replay',
          properties: { replayDuration: getReplayDuration(replay) },
          anonymousId: clientId,
          projectId,
        },
      ],
    })
    await saveReplaySessionsToS3([{ session, replay }])
  }

  const store = await getStore()

  await store.del(replayCacheKey(clientId))
}

/**
 * Process batched data arriving over the socket created queue
 */
export async function processData(dataItem: ReplayComponents): Promise<void> {
  const { config, replay } = dataItem
  const { clientId, projectId } = config

  if (!replay || replay.length === 0)
    return

  const memoryReplay = await getMemoryReplay(clientId)

  // no existing replay started
  // check usage eligibility
  if (!memoryReplay) {
    const { eligible, details } = await isRecordingEligible({ projectId })
    const replayDuration = getReplayDuration(replay)
    const meta = {
      projectId,
      replayLength: replay.length,
      replayDuration,
      details,
      eligible,
    }

    if (!eligible) {
      logger.log({
        level: 'warn',
        context: 'replay',
        description: `(server) replay ineligible to record`,
        data: meta,
      })
      stopRecording(clientId)
      return
    }

    const { total } = await dailyCounter({
      projectId,
      addOne: true,
      item: 'replay',
    })
    logger.log({
      level: 'info',
      context: 'replay',
      description: `new replay: ${total} total`,
    })
  }

  const updatedReplay = [...(memoryReplay ?? []), ...replay]

  // do this last in case changes are saved to session
  await updateMemoryReplay(clientId, updatedReplay)
}

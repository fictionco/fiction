import lodash from 'lodash'
import { logger } from '@factor/api'
import dayjs from 'dayjs'
import type {
  ClickhouseEventFields,
  ClickhouseSessionFields,
  NoExtraKeys,
  PassedEventFields,
  SessionFields,
} from '@kaption/service/fields'
import { clickhouseQuery } from '@kaption/service/dbClickhouse'

/**
 * Send a request to save a list of objects to clickhouse
 */
const saveToClickhouse: {
  (table: 'event', items: ClickhouseEventFields[]): Promise<void>
  (table: 'session', items: ClickhouseSessionFields[]): Promise<void>
} = async (table: unknown, items: unknown[]): Promise<void> => {
  const rowJson = items.map(item => JSON.stringify(item)).join(' ')

  await clickhouseQuery({
    query: `INSERT INTO darwin.${table} FORMAT JSONEachRow ${rowJson}`,
  })
}

async function saveSessionsToClickhouse(sessions: Partial<SessionFields>[]): Promise<void> {
  const clickhouseSessions: ClickhouseSessionFields[] = sessions.map(
    (session: Partial<SessionFields>): ClickhouseSessionFields => {
      const cleaned = lodash.omit(session, [
        'events',
        'startTime',
        'endTime',
        'timestamp',
      ])

      // Use special type check to ensure no extra parameters as these cause clickhouse errors
      // https://stackoverflow.com/questions/61960321/typescript-avoid-extra-properties
      const result: NoExtraKeys<typeof cleaned, ClickhouseSessionFields> = {
        ...cleaned,
        sign: 1 as const,
        startTime: dayjs(session.startTime).unix(),
        endTime: dayjs(session.endTime).unix(),
        timestamp: dayjs(session.timestamp).unix(),
      }

      return result
    },
  )

  await saveToClickhouse('session', clickhouseSessions)
}

/**
 * Save a set of expired sessions to disk
 */
export async function saveSessionBatch(sessions: Partial<SessionFields>[]): Promise<void> {
  logger.log({
    level: 'debug',
    description: `saving ${sessions.length} sessions`,
    data: {
      sessionIds: sessions.map(_ => _.sessionId),
    },
  })

  try {
    await saveSessionsToClickhouse(sessions)
  }
  catch (error) {
    logger.log({
      level: 'error',
      description: `session batch save error`,
      data: error,
    })
  }
}

export async function saveEventBatch(events: PassedEventFields[]): Promise<void> {
  logger.log({
    level: 'info',
    description: `saving ${events.length} events`,
    data: events,
  })

  try {
    // Get clickhouse specific formats
    const clickhouseEvents = events.map(
      (event: PassedEventFields): ClickhouseEventFields => {
        const cleaned = lodash.omit(event, [
          'startTime',
          'endTime',
          'properties',
          'traits',
          'meta',
          'sentAt',
          'receivedAt',
        ])

        const out: ClickhouseEventFields = {
          ...cleaned,
          timestamp: dayjs(event.timestamp).unix(),
          sentAt: dayjs(event.sentAt).unix(),
          receivedAt: dayjs(event.receivedAt).unix(),
        }

        if (event.startTime)
          out.startTime = dayjs(event.startTime).unix()
        if (event.endTime)
          out.endTime = dayjs(event.endTime).unix()
        if (event.properties)
          out.properties = JSON.stringify(event.properties)
        if (event.traits)
          out.traits = JSON.stringify(event.traits)
        if (event.meta)
          out.meta = JSON.stringify(event.meta)

        return out
      },
    )

    await saveToClickhouse('event', clickhouseEvents)
  }
  catch (error) {
    logger.log({
      level: 'error',
      description: `event batch save error`,
      data: error,
    })
  }

  logger.log({ level: 'debug', description: `saved ${events.length} events` })
}

import type { EventParams, SessionEvent } from './plugin-beacon'
import { dayjs, type EndpointMeta, type EndpointResponse, objectId, WriteBuffer } from '@fiction/core'
import { AnalyticsEndpoint } from './endpoints'

export class QueryEventTrack extends AnalyticsEndpoint {
  // Default 1 second buffer flush interval
  private bufferIntervalMs = 1000
  private batchLimit = 10_000

  private writeBuffer = new WriteBuffer<Partial<EventParams>>({
    fictionEnv: this.settings.fictionEnv,
    name: 'eventTrack',
    limit: this.batchLimit,
    flushIntervalMs: this.bufferIntervalMs,
    flush: async (events) => {
      if (!events.length)
        return

      const ch = this.settings.fictionClickHouse
      if (!ch)
        throw new Error('no clickhouse')

      await ch.saveData({
        table: 'event',
        rows: events.map(event => ({
          ...event,
          eventId: objectId(),
          timestamp: event.timestamp || dayjs().unix(),
        })),
      })
    },
  })

  async run(
    params: {
      eventData: {
        orgId: string
        event: string
      } & Partial<EventParams>
      useBuffer?: boolean
    },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse> {
    const { eventData, useBuffer = false } = params

    const finalEventData: Partial<EventParams> = {
      type: 'track',
      timestamp: dayjs().unix(),
      timeAt: dayjs().valueOf(),
      ...eventData,
    }

    try {
      // Use buffer for high-volume writes
      if (useBuffer) {
        this.writeBuffer.add(finalEventData)
        return { status: 'success' }
      }

      // Direct write for single events
      const ch = this.settings.fictionClickHouse
      if (!ch)
        throw new Error('no clickhouse')

      await ch.saveData({
        table: 'event',
        rows: [{
          ...finalEventData,
          eventId: objectId(),
        }],
      })

      return { status: 'success' }
    }
    catch (error) {
      this.log.error('Failed to track event', { data: params, error })
      return { status: 'error', message: 'Failed to track event' }
    }
  }

  // Method to force flush buffer
  async flush(): Promise<void> {
    await this.writeBuffer.flushBuffer({ reason: 'trackFlush' })
  }

  // Method to check buffer size
  getBufferSize(): number {
    return this.writeBuffer.size()
  }
}

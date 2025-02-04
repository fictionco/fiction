import type { LogHelper } from '@fiction/core/plugin-log'

export type QueryPerformanceConfig = {
  warnThresholdMs?: number // Time in ms before logging a warning
  errorThresholdMs?: number // Time in ms before logging an error
  sampleRate?: number // Rate at which to sample queries (0-1)
}

export type QueryMetrics = {
  queryId: string
  startTime: number
  endTime: number
  duration: number
  query: string
  caller: string
}

export class QueryPerformanceTracker {
  private readonly log: LogHelper
  private readonly config: Required<QueryPerformanceConfig>
  private activeQueries = new Map<string, { startTime: number, query: string, caller: string }>()

  constructor(log: LogHelper, config: QueryPerformanceConfig = {}) {
    this.log = log
    this.config = {
      warnThresholdMs: config.warnThresholdMs ?? 1000, // Warn if query takes > 1s
      errorThresholdMs: config.errorThresholdMs ?? 5000, // Error if query takes > 5s
      sampleRate: config.sampleRate ?? 1.0, // Sample 100% of queries by default
    }
  }

  startQuery(queryId: string, query: string, caller: string): void {
    // Only track based on sample rate
    if (Math.random() > this.config.sampleRate)
      return

    this.activeQueries.set(queryId, {
      startTime: performance.now(),
      query,
      caller,
    })
  }

  endQuery(queryId: string): QueryMetrics | undefined {
    const queryData = this.activeQueries.get(queryId)
    if (!queryData)
      return

    const endTime = performance.now()
    const duration = endTime - queryData.startTime
    const metrics: QueryMetrics = {
      queryId,
      startTime: queryData.startTime,
      endTime,
      duration,
      query: queryData.query,
      caller: queryData.caller,
    }

    this.activeQueries.delete(queryId)
    this.checkThresholds(metrics)

    return metrics
  }

  private checkThresholds(metrics: QueryMetrics): void {
    const { duration, query, caller } = metrics
    const { warnThresholdMs, errorThresholdMs } = this.config

    const details = {
      data: {
        duration: `${duration.toFixed(2)}ms`,
        query,
        caller,
      },
    }

    if (duration >= errorThresholdMs) {
      this.log.error('ClickHouse query exceeded error threshold', details)
    }
    else if (duration >= warnThresholdMs) {
      this.log.warn('ClickHouse query exceeded warning threshold', details)
    }
  }
}

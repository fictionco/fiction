import { EventEmitter } from "events"
import { onEvent } from "./event"

type FlushCallback<T> = (
  items: T[],
  context?: FlushContext,
) => any | Promise<any>
type FlushContext = { reason?: string }
type BufferConfig<T = Record<string, any>> = {
  name?: string
  maxSeconds?: number
  flushIntervalMs?: number
  limit?: number
  limitType?: "item" | "size" | "time"
  flush?: FlushCallback<T>
  key?: string
}

export class WriteBuffer<T> extends EventEmitter {
  readonly name: string
  readonly key: string
  private items: T[]
  private limit: number
  private limitType: "item" | "size" | "time"
  private flushCallback?: FlushCallback<T>
  private intervalId?: NodeJS.Timeout
  private flushIntervalMs: number
  constructor(config: BufferConfig<T>) {
    super()

    const {
      name = "unknown",
      maxSeconds,
      flushIntervalMs,
      limit,
      limitType,
      flush,
      key,
    } = config

    this.key = key ?? "_id"
    this.name = name
    this.items = []
    this.limit = limit ?? 5000
    this.limitType = limitType ?? "item"

    this.flushIntervalMs = flushIntervalMs
      ? flushIntervalMs
      : maxSeconds
      ? maxSeconds * 1000
      : 1000
    this.flushCallback = flush

    // Flush on process shutdown
    onEvent("shutdown", () => this.flushBuffer({ reason: "shutdown" }))
  }
  /**
   * Default flush
   */
  protected flush(_items: T[], _context?: FlushContext): void {}
  /**
   * Remove items in buffer without a flush callback
   */
  public clearBuffer(): void {
    this.stopTimeout()
    this.items = []
  }
  /**
   * Flush items in buffer to the saving callback
   */
  public flushBuffer(context: FlushContext = {}): void {
    if (this.items.length == 0) return

    this.stopTimeout()
    // use resolve to ensure is a promise
    Promise.resolve(this.flush(this.items, context)).catch(console.error)

    if (this.flushCallback) {
      Promise.resolve(this.flushCallback(this.items, context)).catch(
        console.error,
      )
    }

    this.emit("flush", this.items)

    this.items = []
  }

  private startTimeout(): void {
    if (!this.intervalId) {
      this.intervalId = setTimeout(
        () => this.flushBuffer({ reason: "timeout" }),
        this.flushIntervalMs,
      )
    }
  }

  private stopTimeout(): void {
    if (this.intervalId) {
      clearTimeout(this.intervalId)
      this.intervalId = undefined
    }
  }

  private maxQueueSizeReached(): boolean {
    let reached = false

    // Only timeout in this scenario
    if (this.limitType == "time") {
      return reached
    } else if (this.limitType == "size") {
      reached = this.size() >= this.limit
    } else {
      reached = this.items.length >= this.limit
    }

    return reached
  }

  public size(): number {
    return JSON.stringify(this.items).length
  }

  public add(item: T): void {
    this.items.push(item)

    this.checkLimit()
  }

  public batch(batch: T[]): void {
    this.items.push(...batch)

    this.checkLimit()
  }

  private checkLimit(): void {
    if (this.maxQueueSizeReached()) {
      this.flushBuffer({ reason: "limit" })
    } else {
      this.startTimeout()
    }
  }
}

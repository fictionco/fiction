import { EventEmitter } from "events"
import { onEvent } from "./event"

type BufferConfig<T = Record<string, any>> = {
  name?: string
  maxSeconds?: number
  limit?: number
  limitType?: "item" | "size" | "time"
  flush?: (items: T[]) => any | Promise<any>
  key?: string
}

export class WriteBuffer<T> extends EventEmitter {
  name: string
  items: T[]
  maxSeconds: number
  limit: number
  limitType: "item" | "size" | "time"
  flush: (items: T[]) => void | Promise<void>
  intervalId?: NodeJS.Timeout
  key: string

  constructor(config: BufferConfig<T>) {
    super()

    const {
      name = "unknown",
      maxSeconds,
      limit,
      limitType,
      flush,
      key,
    } = config

    this.name = name
    this.items = []
    this.limit = limit ?? 5000
    this.limitType = limitType ?? "item"
    this.maxSeconds = maxSeconds ?? 2
    this.flush = flush ?? this.onFlush
    this.key = key ?? "_id"

    // Flush on process shutdown
    onEvent("shutdown", () => this.flushBuffer())
  }
  /**
   * Default flush
   */
  protected onFlush(this: void, _items: T[]): void {}
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
  public flushBuffer(): void {
    if (this.items.length == 0) return

    this.stopTimeout()
    // use resolve to ensure is a promise
    Promise.resolve(this.flush(this.items)).catch((error) => {
      console.error(error)
    })
    this.emit("flush", this.items)
    this.items = []
  }

  private startTimeout(): void {
    if (!this.intervalId && this.maxSeconds) {
      this.intervalId = setTimeout(
        () => this.flushBuffer(),
        this.maxSeconds * 1000,
      )
    }
  }

  private stopTimeout(): void {
    if (this.intervalId && this.maxSeconds) {
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
      this.flushBuffer()
    } else {
      this.startTimeout()
    }
  }
}

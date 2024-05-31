import type { FictionEnv } from '../plugin-env'

type EventDetail<T> = T extends CustomEvent<infer D> ? D : never

export class TypedEventTarget<T extends Record<string, CustomEvent>> extends EventTarget {
  fictionEnv: FictionEnv
  private listeners: Map<string, Set<EventListener>>

  constructor(settings: { fictionEnv: FictionEnv }) {
    super()

    this.fictionEnv = settings.fictionEnv
    this.listeners = new Map()

    this.fictionEnv.cleanupCallbacks.push(() => this.cleanup())
  }

  on<K extends keyof T>(
    type: K,
    listener: (this: TypedEventTarget<T>, ev: T[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void {
    super.addEventListener(type as string, listener as EventListener, options)

    const eventType = type as string
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }
    this.listeners.get(eventType)!.add(listener as EventListener)
  }

  remove<K extends keyof T>(
    type: K,
    listener: (this: TypedEventTarget<T>, ev: T[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void {
    super.removeEventListener(type as string, listener as EventListener, options)

    const eventType = type as string
    this.listeners.get(eventType)?.delete(listener as EventListener)
    if (this.listeners.get(eventType)?.size === 0) {
      this.listeners.delete(eventType)
    }
  }

  emit<K extends keyof T>(type: K, detail: EventDetail<T[K]>): CustomEvent {
    const event = new CustomEvent(type as string, { detail }) as T[K]

    super.dispatchEvent(event)

    return event
  }

  cleanup(): void {
    for (const [type, listeners] of this.listeners.entries()) {
      for (const listener of listeners) {
        super.removeEventListener(type, listener)
      }
    }
    this.listeners.clear()
  }
}

type EventDetail<T> = T extends CustomEvent<infer D> ? D : never

export class TypedEventTarget<T extends Record<string, CustomEvent>> extends EventTarget {
  on<K extends keyof T>(
    type: K,
    listener: (this: TypedEventTarget<T>, ev: T[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void {
    super.addEventListener(type as string, listener as EventListener, options)
  }

  remove<K extends keyof T>(
    type: K,
    listener: (this: TypedEventTarget<T>, ev: T[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void {
    super.removeEventListener(type as string, listener as EventListener, options)
  }

  emit<K extends keyof T>(type: K, detail: EventDetail<T[K]>): CustomEvent {
    const event = new CustomEvent(type as string, { detail }) as T[K]

    super.dispatchEvent(event as Event)

    return event
  }
}

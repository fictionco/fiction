import type { FictionEnv } from '../plugin-env'

type EventDetail<T> = T extends CustomEvent<infer D> ? D : never

export class TypedEventTarget<T extends Record<string, CustomEvent>> extends EventTarget {
  fictionEnv: FictionEnv
  constructor(settings: { fictionEnv: FictionEnv }) {
    super()

    this.fictionEnv = settings.fictionEnv
  }

  on<K extends keyof T>(
    type: K,
    listener: (this: TypedEventTarget<T>, ev: T[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void {
    // don't add event listeners in SSR
    // this prevents memory leaks
    if (this.fictionEnv.isSSR.value)
      return

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

    super.dispatchEvent(event)

    return event
  }
}

import { log } from "../plugin-log"
import { emitEvent } from "./event"
import { HookType, runHooks } from "./hook"

export type NotifyType = "success" | "info" | "warn" | "error"
export type AttentionScope = "modal" | "subtle"
export type NotificationMeta = {
  more?: string
  attention?: AttentionScope
  shownAt?: number
  duration?: number
  data?: unknown
}
export type Notification = {
  type: NotifyType
  message: string
} & NotificationMeta

export type NotifyHookDictionary = {
  notify: { args: [Notification] }
}

type FactorNotifySettings = {
  hooks?: HookType<NotifyHookDictionary>[]
}

export class FactorNotify {
  hooks: HookType<NotifyHookDictionary>[]
  constructor(settings: FactorNotifySettings = {}) {
    this.hooks = settings.hooks ?? []
  }
  emit(type: NotifyType, message: string, meta?: NotificationMeta) {
    const notification = { type, message, ...meta }
    emitEvent("notify", notification)

    runHooks<NotifyHookDictionary>({
      list: this.hooks,
      hook: "notify",
      args: [notification],
    }).catch(console.error)

    if (type == "error" || type == "warn") {
      log.l({
        level: type,
        context: "notification",
        description: message,
        data: meta,
      })
    }
  }

  info(message: string, meta?: NotificationMeta) {
    this.emit("info", message, meta)
  }

  success(message: string, meta?: NotificationMeta) {
    this.emit("success", message, meta)
  }

  error(message: string, meta?: NotificationMeta) {
    this.emit("error", message, meta)
  }

  warning(message: string, meta?: NotificationMeta) {
    this.emit("error", message, meta)
  }
}

export const notify = new FactorNotify()

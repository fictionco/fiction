import { log } from '../plugin-log'
import { emitEvent } from './event'
import type { HookType } from './hook'
import { runHooks } from './hook'

export type NotifyType = 'success' | 'info' | 'warn' | 'error'
export type AttentionScope = 'modal' | 'subtle'
export interface NotificationMeta {
  more?: string
  attention?: AttentionScope
  shownAt?: number
  duration?: number
  data?: unknown
  key?: string
}
export type Notification = {
  type: NotifyType
  message: string
} & NotificationMeta

export type NotifyHookDictionary = {
  notify: { args: [Notification] }
}

interface FictionNotifySettings {
  hooks?: HookType<NotifyHookDictionary>[]
}

export class FictionNotify {
  hooks: HookType<NotifyHookDictionary>[]
  constructor(settings: FictionNotifySettings = {}) {
    this.hooks = settings.hooks ?? []
  }

  emit(type: NotifyType, message: string, meta?: NotificationMeta) {
    const notification = { type, message, ...meta }
    emitEvent('notify', notification)

    runHooks<NotifyHookDictionary>({
      list: this.hooks,
      hook: 'notify',
      args: [notification],
    }).catch(console.error)

    if (type === 'error' || type === 'warn') {
      log.l({
        level: type,
        context: 'notification',
        description: message,
        data: meta,
      })
    }
  }

  info(message: string, meta?: NotificationMeta) {
    this.emit('info', message, meta)
  }

  success(message: string, meta?: NotificationMeta) {
    this.emit('success', message, meta)
  }

  error(message: string, meta?: NotificationMeta) {
    this.emit('error', message, meta)
  }

  warning(message: string, meta?: NotificationMeta) {
    this.emit('error', message, meta)
  }
}

export const notify = new FictionNotify()

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
export type UserNotification = {
  type: NotifyType
  message: string
} & NotificationMeta

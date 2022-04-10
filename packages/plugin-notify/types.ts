export interface NotificationOptions {
  type: "success" | "error"
  message: string
  more?: string
  duration?: number
}

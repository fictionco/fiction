export interface JSendMessage {
  status: 'success' | 'error' | 'event'
  messageType: string
  data?: any
  message?: string
}

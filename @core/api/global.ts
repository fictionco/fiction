export {}

declare global {
  interface Window {
    process: { env?: Record<string, string> }
  }
}

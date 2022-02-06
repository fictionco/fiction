export {}

declare global {
  interface Window {
    $filters: any
    $pageMeta: any
    process: { env?: Record<string, string> }
  }
  namespace NodeJS {
    interface Global {
      $filters: any
      $pageMeta: any
    }
  }
}

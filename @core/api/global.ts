export {}

declare global {
  interface Window {
    $filters: any
  }
  namespace NodeJS {
    interface Global {
      $filters: any
      $pageMeta: any
    }
  }
}

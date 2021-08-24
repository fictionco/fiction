export {}

declare global {
  interface Window {
    $filters: any
    $pageMeta: any
    LinkMink?: any
  }
  namespace NodeJS {
    interface Global {
      $filters: any
      $pageMeta: any
      __VUE_PROD_DEVTOOLS__: any // needed for vuex bug
    }
  }
}

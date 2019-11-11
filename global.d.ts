declare module "*.png"
declare module "*.jpg"
declare module "*.json"
declare module "*.svg"
declare module "*.vue"
declare module "*.md"
declare module "*package"

interface Window {
  __INITIAL_STATE__: any
  factorReady: boolean
  factorApp: Object
}

declare module "vue/types/vue" {
  interface Vue {
    metaInfoCore: Function
  }
}

declare module "jest"

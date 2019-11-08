declare module "*.png"
declare module "*.jpg"
declare module "*.json"
declare module "*.svg"
declare module "*.vue"
declare module "*package"

interface Window {
  __INITIAL_STATE__: any
}

declare module "vue/types/vue" {
  // 3. Declare augmentation for Vue
  interface Vue {
    use: Function
  }
}

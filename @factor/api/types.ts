import "vue"

declare module "vue/types/vue" {
  export interface VueConstructor {
    $factorSettings: object;
  }
}

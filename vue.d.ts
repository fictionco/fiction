import Vue from "vue"
declare module "vue/types/vue" {
  interface VueConstructor {
    metaInfoCore: any
    $factorSettings: any
  }
  interface Vue {
    metaInfoCore: any
    $factorSettings: any
  }
}

import Vue from "vue"
import VueRouter from "vue-router"
declare module "vue/types/vue" {
  export interface Vue {
    ui: string;
  }
}

declare module "@vue/test-utils" {
  interface MountOptions {
    router: VueRouter;
  }
}

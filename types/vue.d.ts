import Vue from "vue"
import VueRouter from "vue-router"
declare module "vue/types/vue" {
  export interface VueConstructor {
    $router: VueRouter;
    metaInfoCore: () => {};
    observable: <T>(obj: T) => T;
  }

  interface Vue {
    metaInfoCore(): object;
    observable: <T>(obj: T) => T;
    $filters: any;
  }
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    metaInfoCore?: () => {};
    serverPrefetch?(): Promise<void>;
  }
}

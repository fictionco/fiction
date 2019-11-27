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
  }
}

export interface templateOption {
  input?: string;
  label?: string;
  _id?: string;
  default?: string;
  description?: string;
  settings?: templateOption[];
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    metaInfoCore?: () => {};
    serverPrefetch?(): Promise<void>;
    templateSettings?: () => templateOption[];
  }
}

import Vue from "vue"
import VueRouter, { Route } from "vue-router"
declare module "vue/types/vue" {
  export interface VueConstructor {
    $router: VueRouter;
    metaInfoCore: () => {};
    observable: <T>(obj: T) => T;
    scrollClass: string[] | string;
    $route: Route;
  }

  interface Vue {
    metaInfoCore(): object;
    serverPrefetch?(): Promise<void>;
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
  interface ComponentOptions<Vue> {
    metaInfoCore?: () => {};
    serverPrefetch?(): Promise<void>;
    templateSettings?: () => templateOption[];
  }
}

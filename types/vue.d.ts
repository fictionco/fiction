import Vue from "vue"
import VueRouter, { Route } from "vue-router"
import { TemplateOption } from "@factor/templates/types"
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

declare module "vue/types/options" {
  interface ComponentOptions<Vue> {
    metaInfoCore?: () => {};
    serverPrefetch?(): Promise<void>;
    templateSettings?: () => TemplateOption[];
  }
}

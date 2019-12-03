import Vue from "vue"
import VueRouter, { Route } from "vue-router"
import { TemplateOption } from "@factor/templates/types"
declare module "vue/types/vue" {
  export interface VueConstructor {
    $router: VueRouter;
    metaInfoCore: () => {};
    observable: <T>(obj: T) => T;
    scrollClass: string[] | string;
    routeClass: string[] | string;
    $route: Route;
  }

  export interface Vue {
    metaInfoCore(): object;
    serverPrefetch?(): Promise<void>;
    observable: <T>(obj: T) => T;
    routeClass: Function | string[] | string;
  }
}

declare module "vue/types/options" {
  export interface ComponentOptions<Vue> {
    metaInfoCore?: () => {};
    serverPrefetch?(): Promise<void>;
    templateSettings?: () => TemplateOption[];
  }
}

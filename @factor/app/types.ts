import Vue from "vue"
import VueRouter, { Route, RawLocation } from "vue-router"
import { Store } from "vuex/types"

export interface RouteGuard {
  to: Route;
  from: Route;
  next: (to?: RawLocation | false) => void;
}

export interface ServerRenderContext {
  url: string;
  state?: object;
  [key: string]: any;
}

export interface ApplicationComponents {
  vm: Vue;
  router: VueRouter;
  store: Store<any>;
  context: ServerRenderContext;
}

declare module "vue-router" {
  interface RouteConfig {
    priority?: number;
  }
}

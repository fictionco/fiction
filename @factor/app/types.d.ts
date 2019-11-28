import Vue from "vue"
import VueRouter from "vue-router"
import { Store } from "vuex/types"
export interface ServerRenderContext {
  url: string;
  state?: object;
  [key: string]: any;
}

export interface ApplicationComponents {
  vm: Vue;
  router: VueRouter;
  store: Store<any>;
  context?: ServerRenderContext;
}

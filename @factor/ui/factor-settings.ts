import { Component } from "vue"
export default {
  core: {
    components: {
      btn: (): Promise<Component> => import("./el/btn.vue"),
      btnDashboard: (): Promise<Component> => import("./el/btn-dashboard.vue"),
      btnBase: (): Promise<Component> => import("./el/btn-base.vue"),
      link: (): Promise<Component> => import("./el/link.vue"),
      loadingRing: (): Promise<Component> => import("./el/loading-ring.vue"),
      modal: (): Promise<Component> => import("./el/modal.vue"),
      modalApp: (): Promise<Component> => import("./el/modal.vue"),
      lightbox: (): Promise<Component> => import("./el/lightbox.vue")
    }
  }
}

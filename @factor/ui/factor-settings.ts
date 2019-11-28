import Vue from "vue"
export default {
  core: {
    components: {
      btn: (): Promise<Vue> => import("./el/btn.vue"),
      btnDashboard: (): Promise<Vue> => import("./el/btn-dashboard.vue"),
      btnBase: (): Promise<Vue> => import("./el/btn-base.vue"),
      link: (): Promise<Vue> => import("./el/link.vue"),
      loadingRing: (): Promise<Vue> => import("./el/loading-ring.vue"),
      modal: (): Promise<Vue> => import("./el/modal.vue"),
      modalApp: (): Promise<Vue> => import("./el/modal.vue"),
      lightbox: (): Promise<Vue> => import("./el/lightbox.vue")
    }
  }
}

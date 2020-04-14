export default {
  core: {
    components: {
      btn: (): Promise<any> => import("./el/btn.vue"),
      btnDashboard: (): Promise<any> => import("./el/btn-dashboard.vue"),
      btnBase: (): Promise<any> => import("./el/btn-base.vue"),
      link: (): Promise<any> => import("./el/link.vue"),
      loadingRing: (): Promise<any> => import("./el/loading-ring.vue"),
      modal: (): Promise<any> => import("./el/modal.vue"),
      modalApp: (): Promise<any> => import("./el/modal.vue"),
      lightbox: (): Promise<any> => import("./el/lightbox.vue"),
    },
  },
}

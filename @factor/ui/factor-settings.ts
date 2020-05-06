export default {
  core: {
    components: {
      btn: (): Promise<any> => import("./el/btn.vue"),
      dashboardBtn: (): Promise<any> => import("./dashboard/btn.vue"),
      btnBase: (): Promise<any> => import("./el/btn-base.vue"),
      link: (): Promise<any> => import("./el/link.vue"),
      spinner: (): Promise<any> => import("./el/spinner.vue"),
      modal: (): Promise<any> => import("./el/modal.vue"),
      modalApp: (): Promise<any> => import("./el/modal.vue"),
      lightbox: (): Promise<any> => import("./el/lightbox.vue"),
    },
  },
}

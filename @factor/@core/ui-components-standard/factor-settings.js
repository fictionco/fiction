export default Factor => {
  return {
    core: {
      components: {
        btn: () => import("./el/btn.vue"),
        btnDashboard: () => import("./el/btn-dashboard.vue"),
        btnBase: () => import("./el/btn-base.vue"),
        link: () => import("./el/link.vue"),
        loadingRing: () => import("./el/loading-ring.vue"),
        modal: () => import("./el/modal.vue"),
        modalApp: () => import("./el/modal.vue"),
        lightbox: () => import("./el/lightbox.vue")
      }
    }
  }
}

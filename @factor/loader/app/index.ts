import Vue, { Component, CreateElement, VNode } from "vue"
import VueRouter from "vue-router"
import Site from "./site.vue"

Vue.use(VueRouter)

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/setup",
      component: (): Promise<Component> => import("./setup.vue")
    },
    {
      path: "*",
      component: (): Promise<Component> => import("./loading.vue")
    }
  ]
})

// Vue.config.devtools = true
window._factorLoadingScreen = new Vue({
  render: (h: CreateElement): VNode => h(Site),
  router
}).$mount("#app")

router.onReady(() => {
  window._factorLoadingScreen.$mount("#app")
})

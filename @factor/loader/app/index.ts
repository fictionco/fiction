import Vue, { CreateElement, VNode } from "vue"
import VueRouter from "vue-router"
import Site from "./site.vue"

// Show VUE dev tools in production build
Vue.config.devtools = true

Vue.use(VueRouter)

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/setup",
      component: (): Promise<any> => import("./setup.vue"),
    },
    {
      path: "*",
      component: (): Promise<any> => import("./loading.vue"),
    },
  ],
})

window._factorLoadingScreen = new Vue({
  render: (h: CreateElement): VNode => h(Site),
  router,
}).$mount("#app")

router.onReady(() => {
  window._factorLoadingScreen.$mount("#app")
})

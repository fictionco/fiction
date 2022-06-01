// eslint-disable-next-line import/no-unresolved
import "uno.css"
import "@unocss/reset/tailwind.css"
import { createApp } from "vue"
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import PageHome from "./el/PageHome.vue"
import PageWrap from "./el/PageWrap.vue"
import PageSingle from "./el/PageSingle.vue"

const app = createApp(PageWrap)

const history = createWebHistory()

const routes: RouteRecordRaw[] = [
  {
    name: "home",
    path: "/",
    component: PageHome,
  },
  { name: "page", path: "/page", component: PageSingle },
]
const router = createRouter({ history, routes })

app.use(router)

app.mount("#app")

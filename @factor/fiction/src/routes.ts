import { AppRoute } from "@factor/api"
import PageHome from "./PageHome.vue"

export const routes = [
  new AppRoute({
    name: "home",
    path: "/",
    component: PageHome,
  }),
]

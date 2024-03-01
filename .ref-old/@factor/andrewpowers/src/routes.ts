import PageHome from "./PageHome.vue"
import { AppRoute } from "@factor/api"

export const routes = [
  new AppRoute({
    name: "home",
    path: "/",
    component: PageHome,
  }),
]

import ViewHome from "./el/ViewHome.vue"
import { UserConfigApp } from "@factor/api"

const routes = [
  {
    path: "/",
    component: ViewHome,
  },
]

export const setup = (): UserConfigApp => {
  return {
    routes,
    plugins: [],
  }
}

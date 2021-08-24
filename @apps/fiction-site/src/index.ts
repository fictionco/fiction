import { addRoutes } from "@factor/api/router"

import ViewHome from "./el/ViewHome.vue"

addRoutes([
  {
    path: "/",
    component: ViewHome,
  },
])

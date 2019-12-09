import { addContentRoute } from "@factor/api"

export const setup = (): void => {
  addContentRoute({
    path: "/basic",
    component: () => import("./v-basic.vue")
  })

  addContentRoute({
    path: "/mutation",
    component: () => import("./v-mutation.vue")
  })

  addContentRoute({
    path: "/store-data",
    component: () => import("./v-store-data.vue")
  })
}

setup()

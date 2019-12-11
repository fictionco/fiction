// This is the standard format for a Factor extension
// Use this file to add routes, global components, config, etc.

import { addContentRoute } from "@factor/api"

export const setup = (): void => {

  addContentRoute({
    path: '/',
    component: () => import("./home.vue")
  })
}

setup()
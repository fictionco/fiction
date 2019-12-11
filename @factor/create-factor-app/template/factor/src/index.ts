// This is the standard format for a Factor extension
// Use this file to add routes, global components, config, etc.

import { addFilter, setting, addContentRoute } from "@factor/api"

export const setup = (): void => {

  addFilter({
    key: "theFont",
    hook: "factor_head",
    callback: (_: string[]) => {
      return [..._, setting("headTags.font")]
    },
    priority: 200
  })

  addContentRoute({
    path: '/',
    component: () => import("./home.vue")
  })
}

setup()
import { addFilter, setting } from "@factor/tools"
import { addPageTemplate } from "@factor/templates"

addFilter(
  "factor_head",
  _ => {
    return [..._, setting("headTags.font")]
  },
  { priority: 200 }
)

// POST TYPES

const baseRoute = setting("work.postRoute")

addFilter("post-types-config", _ => {
  _.push({
    postType: "work",
    baseRoute,
    icon: require("./img/work.svg"),
    model: "WorkPost",
    nameIndex: "Work",
    nameSingle: "Work Post",
    namePlural: "Work Posts"
  })

  return _
})

// PAGE TEMPLATES

addPageTemplate({
  _id: "default",
  component: () => import("./page-template-default.vue")
})

// CONTENT ROUTES

addFilter("content-routes", _ => {
  const routes = [
    {
      path: "/",
      component: () => import("./page-home.vue"),
      meta: { nav: true }
    },
    {
      path: "/about",
      component: () => import("./page-about.vue"),
      meta: { nav: true }
    },
    {
      path: setting("work.indexRoute"),
      component: setting("work.components.workWrap"),
      children: [
        {
          path: "/",
          component: setting("work.components.workIndex")
        },
        {
          path: `${setting("work.postRoute")}/:permalink`,
          component: setting("work.components.workSingle")
        }
      ]
    },
    {
      path: "/contact",
      component: () => import("./page-contact.vue"),
      meta: { nav: true }
    }
  ]

  return _.concat(routes)
})

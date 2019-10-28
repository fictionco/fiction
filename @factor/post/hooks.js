import { addFilter, addCallback } from "@factor/filters/util"
import { prefetchPost } from "@factor/post"
import { applyFilters } from "@factor/tools"

addCallback("site-prefetch", _ => prefetchPost(_))
addCallback("client-route-before", _ => prefetchPost({ clientOnly: true, ..._ }))

addFilter("components", _ => {
  _["factor-post-edit"] = () => import("./el/edit-link")
  return _
})

addFilter("dashboard-routes", _ => {
  return [
    ..._,
    {
      path: "posts",
      component: () => import("./view/dashboard-list")
    },
    {
      path: "posts/edit",
      component: () => import("./view/dashboard-edit")
    },
    {
      path: "posts/:postType/edit",
      component: () => import("./view/dashboard-edit")
    },
    {
      path: "posts/:postType/add-new",
      component: () => import("./view/dashboard-edit")
    },
    {
      path: "posts/:postType",
      component: () => import("./view/dashboard-list")
    }
  ]
})

// Assign Post Info to Route
// Has to happen after all initialized
// addFilter("mixins", _ => {
//   //_.post = this.addPostToComponents()

//   return _
// })

addFilter("admin-menu", _ => {
  this.getPostTypes()
    .filter(({ showAdmin, accessLevel }) => {
      return showAdmin === false || (accessLevel && !Factor.$user.can({ accessLevel }))
        ? false
        : true
    })
    .forEach(({ postType, namePlural, icon = "", add = "add-new" }) => {
      const subMenu = []

      if (add) {
        subMenu.push({ path: add, name: toLabel(add) })
      }

      subMenu.push({ path: "edit" })

      _.push({
        group: postType,
        path: `posts/${postType}`,
        name: namePlural || toLabel(postType),
        icon,
        items: applyFilters(`admin-menu-post-${postType}`, subMenu)
      })
    })

  return _
})

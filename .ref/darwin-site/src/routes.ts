import GuidesWrap from "./guides/GuidesWrap.vue"
import Site404 from "./_global/Site404.vue"
import { routes as pageRoutes } from "./pages/routes"
import { routes as blogRoutes } from "./blog/routes"
import { routes as docsRoutes } from "./docs/routes"
import { RouteRecordRaw } from "vue-router"

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: (): Promise<any> => import("./_home/ViewHome.vue"),
  },
  {
    path: "/features/:featureId",
    component: (): Promise<any> => import("./_features/ViewFeature.vue"),
  },

  {
    path: "/about",
    component: (): Promise<any> => import("./_about/ViewAbout.vue"),
  },
  {
    path: "/demo",
    component: (): Promise<any> => import("./_demo/ViewDemo.vue"),
  },

  {
    path: "/support",
    component: (): Promise<any> => import("./_contact/ViewSupport.vue"),
  },
  {
    path: "/pro",
    component: (): Promise<any> => import("./_pricing/ViewPricing.vue"),
  },
  {
    path: "/affiliate",
    component: (): Promise<any> => import("./_affiliate/ViewAffiliate.vue"),
  },
  {
    path: "/guides",
    component: (): Promise<any> => import("./guides/ViewGuides.vue"),
  },
  {
    path: `/guides/:guide`,
    component: GuidesWrap,
  },
  {
    path: `/guides/:guide/:subGuide`,
    component: GuidesWrap,
  },
  ...blogRoutes,
  ...pageRoutes,
  ...docsRoutes,
  {
    path: "/:pathMatch(.*)*",
    component: Site404,
  },
]

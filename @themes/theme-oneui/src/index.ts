import BootstrapVue from "bootstrap-vue"
import { Schema } from "mongoose"
import { getPrimaryApp } from "@factor/app/app"
import { addFilter } from "@factor/api"
import { RouteConfig } from "vue-router"

const Vue = getPrimaryApp()
Vue.use(BootstrapVue)

addFilter({
  hook: "routes",
  key: "meta-ui",
  callback: (routes: RouteConfig[]) =>
    routes.map((route) => ({
      ...route,
      meta: {
        ...route.meta,
        ui: "oneui",
      },
    })),
  priority: 200,
})

const setup = (): void => {
  addFilter({
    hook: "webpack-loaders",
    key: "sass-loader",
    callback: (loaders: any[]) => {
      loaders.push({
        test: /\.scss$/,
        use: ["vue-style-loader", "css-loader", "sass-loader"],
      })
      return loaders
    },
  })

  addFilter({
    key: "theme-axians-avatar",
    hook: "user-schema-hooks",
    callback: (schema: Schema) => {
      schema.virtual("axiansAvatar").get(function () {
        return `https://api.axians.de/getpic.php?oauth_token=f89q43Zcure957a3454&mail=${
          (this as any).username
        }`
      })
      return schema
    },
  })
}

setup()

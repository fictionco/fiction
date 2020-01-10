import { isLoggedIn } from "@factor/user"
import { accountMenu } from "@factor/dashboard"
import { Component } from "vue"
export default {
  app: { url: "https://factor.dev" },
  metaInfo: {
    default: {
      image: require("./src/static/factor-logo.jpg")
    }
  },
  emailList: {
    alphaProgram: { tags: ["factor-dev"] }
  },
  docs: {
    base: "guide",
    pages: [
      { group: "getting-started" },
      { root: true, slug: "introduction" },
      {
        slug: "quickstart",
        description: "Get started using Factor CMS in less than 5 minutes."
      },
      { slug: "dashboard-setup" },
      { slug: "basic-example" },
      { group: "app-development" },
      { slug: "structure" },
      { slug: "plugins-and-themes" },
      { slug: "settings-and-style" },
      { slug: "posts-and-pages" },
      { slug: "cli", name: "CLI" },
      { slug: "router-and-store" },
      { slug: "metainfo", name: "Meta Info" },
      { slug: "working-with-posts" },
      { slug: "endpoints-and-middleware" },
      { slug: "ssr", name: "Server-Side Rendering" },
      { slug: "deployment" },
      { group: "extension-development" },
      { slug: "creating-plugins" },
      { slug: "creating-themes" },
      { slug: "filters-callbacks-events", name: "Filters, Callbacks and Events" },
      { slug: "extend-the-dashboard" },
      { slug: "extend-the-cli", name: "Extend the CLI" },
      { group: "contributing" },
      { slug: "contribution" },
      { slug: "philosophy" }
    ]
  },
  site: {
    logo: (): Promise<Component> => import("./src/el/logo-factor.vue"),
    nav: [
      { path: "/guide", name: "Development Guide" },
      { path: "/themes", name: "Themes" },
      { path: "/plugins", name: "Plugins" },

      {
        path: "https://github.com/fiction-com/factor",
        name: "Github",
        icon: "github",
        target: "_blank"
      },
      {
        event: "sign-in-modal",
        name: "Sign In &rarr;",
        condition: (): boolean => !isLoggedIn()
      },
      { component: accountMenu, condition: (): boolean => isLoggedIn() }
    ]
  },
  plugins: {
    cta: {
      title: "Create and Submit Your Plugin",
      subtitle:
        "Learn about extension development and how to submit your extension to the Factor library."
    }
  },

  footer: {
    headline: "Released under the GPL-2 License",
    legal: "Copyright &copy; - <a href='https://www.fiction.com'>Fiction.com</a>",
    logo: (): Promise<Component> => import("./src/el/logo-fiction.vue"),
    logo2: (): Promise<Component> => import("./src/el/logo-pagelines.vue")
  }
}

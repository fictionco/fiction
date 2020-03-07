import { Component } from "vue"
import comparison from "./docs/comparison.vue"
export default {
  app: { url: "https://factor.dev" },
  metaInfo: {
    default: {
      image: require("./src/static/factor-logo.jpg")
    }
  },
  components: {
    comparison
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
    logo: (): Promise<Component> => import("./src/el/logo-factor.vue")
  },
  blog: {
    title: "Factor Blog",
    content: "Learn coding tips and tricks. Get updates, build successful apps.",
    indexRoute: "/blog",
    postRoute: "/entry",
    limit: 6,
    returnLinkText: "Back",
    notFound: {
      title: "No Posts",
      subTitle: "Couldn't find any blog posts."
    },
    categories: ["releases", "tutorials", "how-to", "company", "showcase"],
    promo: {
      pretitle: "The JavaScript CMS",
      title: "Build something incredible today",
      content: "Factor will help you launch websites and applications faster.",
      button: {
        link: "/install",
        text: "Install Factor"
      }
    },
    metatags: {
      index: {
        title: "Factor Blog",
        description: "The latest news and articles."
      }
    },
    components: {
      blogIndex: (): Promise<Component> => import("./src/blog/blog-index.vue"),
      blogSingle: (): Promise<Component> => import("./src/blog/blog-single.vue"),
      featuredImage: (): Promise<Component> => import("./src/blog/el-featured-image.vue"),
      title: (): Promise<Component> => import("./src/blog/widget-title.vue"),
      date: (): Promise<Component> => import("./src/blog/widget-date.vue"),
      author: (): Promise<Component> => import("./src/blog/widget-author.vue"),
      singleHeader: (): Promise<Component> => import("./src/blog/el-single-header.vue"),
      entry: (): Promise<Component> => import("./src/blog/widget-entry.vue"),
      social: (): Promise<Component> => import("./src/blog/widget-social.vue"),
      pagination: (): Promise<Component> => import("./src/blog/widget-pagination.vue")
    },
    layout: {
      index: ["featuredImage", "date", "title", "author"],
      single: ["singleHeader", "entry", "social"]
    }
  },
  plugins: {
    cta: {
      title: "Create and Submit Your Plugin",
      subtitle:
        "Learn about extension development and how to submit your extension to the Factor library."
    }
  },
  footer: {
    legal:
      "&copy; 2020 <a href='https://www.fiction.com'>Fiction.com</a> Inc. Released under the GPL-2 License."
  }
}

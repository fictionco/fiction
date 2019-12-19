import { Component } from "vue"

export default {
  app: {
    url: "https://www.fiction.com"
  },
  emailList: {
    alphaProgram: {
      tags: ["fiction-com"],
      form: {
        buttonText: "Request Invite &rarr;"
      }
    }
  },
  blog: {
    indexRoute: "/blog",
    postRoute: "/entry",
    limit: 6,
    returnLinkText: "Back",
    components: {
      blogWrap: (): Promise<Component> => import("./blog/blog-wrap.vue"),
      blogIndex: (): Promise<Component> => import("./blog/blog-index.vue"),
      blogSingle: (): Promise<Component> => import("./blog/blog-single.vue"),
      featuredImage: (): Promise<Component> => import("./blog/el-featured-image.vue"),
      title: (): Promise<Component> => import("./blog/widget-title.vue"),
      subtitle: (): Promise<Component> => import("./blog/widget-subtitle.vue"),
      singleHeader: (): Promise<Component> => import("./blog/el-single-header.vue")
    },
    layout: {
      index: ["title", "subtitle", "meta"],
      single: [
        "singleHeader",
        "meta",
        "entry",
        "social",
        "authorBio"
      ],
      meta: ["authorDate", "tags"]
    }
  },
  jobs: {
    indexRoute: "/careers",
    postRoute: "/careers",
    limit: 5,
    settings: {
      settingsPanel: (): Promise<Component> => import("./jobs/edit-post-settings.vue"),
    },
    components: {
      jobsContent: (): Promise<Component> => import("./jobs/content.vue"),
      jobsIndex: (): Promise<Component> => import("./jobs/index.vue"),
      jobsSingle: (): Promise<Component> => import("./jobs/single.vue"),
      singleHeader: (): Promise<Component> => import("./jobs/widget-single-header.vue")
    },
    layout: {
      index: ["headers"],
      single: ["singleHeader", "featuredImage", "entry", "cta"]
    },
    metatags: {
      index: {
        title: "Fiction Careers - Building Apps, Code, Remote Work",
        description: "Fiction Careers."
      }
    }
  }
}

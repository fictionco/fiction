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
      blogFeaturedImage: (): Promise<Component> => import("./blog/el-featured-image.vue"),
      blogHeaders: (): Promise<Component> => import("./blog/el-headers.vue"),
      blogReturnLink: (): Promise<Component> => import("./blog/el-return-link.vue"),
      blogExcerpt: (): Promise<Component> => import("./blog/el-excerpt.vue"),
      blogMeta: (): Promise<Component> => import("./blog/el-meta.vue")
    },
    layout: {
      index: ["blogFeaturedImage", "blogHeaders", "blogMeta"],
      single: [
        "blogHeaders",
        "blogFeaturedImage",
        "blogMeta",
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
    metatags: {
      index: {
        title: "Fiction Careers - Building Apps, Code, Remote Work",
        description: "Fiction Careers."
      }
    },
    layout: {
      index: ["headers"],
      single: ["singleHeaders", "featuredImage", "entry", "cta"]
    },
    components: {
      jobsContent: (): Promise<Component> => import("./jobs/content.vue"),
      jobsIndex: (): Promise<Component> => import("./jobs/index.vue"),
      jobsSingle: (): Promise<Component> => import("./jobs/single.vue"),
      singleHeaders: (): Promise<Component> => import("./jobs/widget-single-headers.vue")
    }
  }
}

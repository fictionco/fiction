import { Component } from "vue"

export default {
  app: {
    url: "https://www.fiction.com"
  },
  emailList: {
    alphaProgram: {
      tags: ["fiction-com"],
      form: {
        buttonText: "Apply for Dev Program &rarr;"
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
      customSingleHeader: (): Promise<Component> => import("./blog/el-single-header.vue")
    },
    layout: {
      index: ["title", "subtitle", "meta"],
      single: ["customSingleHeader", "meta", "entry", "social", "authorBio"],
      meta: ["authorDate", "tags"]
    }
  },
  jobs: {
    indexRoute: "/careers",
    postRoute: "/careers",
    limit: 6,
    returnLinkText: "All Jobs",
    metatags: {
      index: {
        title: "Fiction Jobs - Building Apps, Code, Remote Work",
        description: "Fiction jobs."
      }
    },
    notFound: {
      title: "No Posts",
      subTitle: "Couldn't find any job posts."
    },
    layout: {
      index: ["featuredImage", "title", "subtitle"],
      single: [
        "singleHeader",
        "entry",
        "cta"
      ]
    },
    components: {
      jobsWrap: (): Promise<Component> => import("./jobs/wrap.vue"),
      jobsIndex: (): Promise<Component> => import("./jobs/index.vue"),
      jobsSingle: (): Promise<Component> => import("./jobs/single.vue"),
      singleHeader: (): Promise<Component> => import("./jobs/single-header.vue"),
      cta: (): Promise<Component> => import("./jobs/cta.vue")
    }
  }
}

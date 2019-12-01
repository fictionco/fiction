import { Component } from "vue"
export default {
  jobs: {
    indexRoute: "/jobs",
    postRoute: "/jobs",
    limit: 10,
    notFound: {
      title: "No Posts",
      subTitle: "Couldn't find any job posts."
    },
    components: {
      jobsContent: (): Promise<Component> => import("./jobs-content.vue"),
      jobsIndex: (): Promise<Component> => import("./jobs-index.vue"),
      jobsSingle: (): Promise<Component> => import("./jobs-single.vue"),
      pagination: (): Promise<Component> => import("./widget-pagination.vue"),
      entry: (): Promise<Component> => import("./widget-entry.vue"),
      excerpt: (): Promise<Component> => import("./widget-excerpt.vue"),
      featuredImage: (): Promise<Component> => import("./widget-featured-image.vue"),
      headers: (): Promise<Component> => import("./widget-headers.vue"),
      singleHeaders: (): Promise<Component> => import("./widget-single-headers.vue"),
      cta: (): Promise<Component> => import("./widget-cta.vue")
    },
    layout: {
      index: ["headers", "excerpt"],
      single: ["singleHeaders", "featuredImage", "entry", "cta"]
    },
    metatags: {
      index: {
        title: "Fiction Jobs - Building Apps, Code, Remote Work",
        description: "Fiction jobs."
      }
    }
  }
}

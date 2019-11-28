import Vue from "vue"
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
      jobsContent: (): Promise<Vue> => import("./jobs-content.vue"),
      jobsIndex: (): Promise<Vue> => import("./jobs-index.vue"),
      jobsSingle: (): Promise<Vue> => import("./jobs-single.vue"),
      pagination: (): Promise<Vue> => import("./widget-pagination.vue"),
      entry: (): Promise<Vue> => import("./widget-entry.vue"),
      excerpt: (): Promise<Vue> => import("./widget-excerpt.vue"),
      featuredImage: (): Promise<Vue> => import("./widget-featured-image.vue"),
      headers: (): Promise<Vue> => import("./widget-headers.vue"),
      singleHeaders: (): Promise<Vue> => import("./widget-single-headers.vue"),
      cta: (): Promise<Vue> => import("./widget-cta.vue")
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

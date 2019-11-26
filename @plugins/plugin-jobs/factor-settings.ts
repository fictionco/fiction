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
      jobsContent: () => import("./jobs-content.vue"),
      jobsIndex: () => import("./jobs-index.vue"),
      jobsSingle: () => import("./jobs-single.vue"),
      pagination: () => import("./widget-pagination.vue"),
      entry: () => import("./widget-entry.vue"),
      excerpt: () => import("./widget-excerpt.vue"),
      featuredImage: () => import("./widget-featured-image.vue"),
      headers: () => import("./widget-headers.vue"),
      singleHeaders: () => import("./widget-single-headers.vue"),
      cta: () => import("./widget-cta.vue")
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

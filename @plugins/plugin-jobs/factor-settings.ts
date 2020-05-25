export default {
  jobs: {
    indexRoute: "/jobs",
    postRoute: "/jobs",
    limit: 2,
    returnLinkText: "All Jobs",
    settings: {
      settingsPanel: (): Promise<any> => import("./edit-post-settings.vue"),
    },
    metatags: {
      index: {
        title: "Fiction Jobs - Building Apps, Code, Remote Work",
        description: "Fiction jobs.",
      },
    },
    notFound: {
      title: "No Posts",
      subTitle: "Couldn't find any job posts.",
    },
    layout: {
      index: ["featuredImage", "title", "synopsis", "meta"],
      single: ["returnLink", "featuredImage", "title", "meta", "entry", "cta"],
    },
    components: {
      jobsWrap: (): Promise<any> => import("./jobs-wrap.vue"),
      jobsIndex: (): Promise<any> => import("./jobs-index.vue"),
      jobsSingle: (): Promise<any> => import("./jobs-single.vue"),
      returnLink: (): Promise<any> => import("./widget-return-link.vue"),
      featuredImage: (): Promise<any> => import("./widget-featured-image.vue"),
      title: (): Promise<any> => import("./widget-title.vue"),
      meta: (): Promise<any> => import("./widget-meta.vue"),
      tags: (): Promise<any> => import("./widget-tags.vue"),
      synopsis: (): Promise<any> => import("./widget-synopsis.vue"),
      pagination: (): Promise<any> => import("./widget-pagination.vue"),
      entry: (): Promise<any> => import("./widget-entry.vue"),
      excerpt: (): Promise<any> => import("./widget-excerpt.vue"),
      cta: (): Promise<any> => import("./widget-cta.vue"),
    },
  },
}

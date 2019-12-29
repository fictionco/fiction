import { Component } from "vue"
export default {
  jobs: {
    indexRoute: "/jobs",
    postRoute: "/jobs",
    limit: 2,
    returnLinkText: "All Jobs",
    settings: {
      settingsPanel: (): Promise<Component> => import("./edit-post-settings.vue"),
    },
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
      index: ["featuredImage", "title", "meta", "subtitle"],
      single: [
        "returnLink",
        "featuredImage",
        "title",
        "meta",
        "subtitle",
        "entry",
        "cta"
      ],
    },
    components: {
      jobsWrap: (): Promise<Component> => import("./jobs-wrap.vue"),
      jobsIndex: (): Promise<Component> => import("./jobs-index.vue"),
      jobsSingle: (): Promise<Component> => import("./jobs-single.vue"),
      returnLink: (): Promise<Component> => import("./widget-return-link.vue"),
      featuredImage: (): Promise<Component> => import("./widget-featured-image.vue"),
      title: (): Promise<Component> => import("./widget-title.vue"),
      meta: (): Promise<Component> => import("./widget-meta.vue"),
      tags: (): Promise<Component> => import("./widget-tags.vue"),
      subtitle: (): Promise<Component> => import("./widget-subtitle.vue"),
      pagination: (): Promise<Component> => import("./widget-pagination.vue"),
      entry: (): Promise<Component> => import("./widget-entry.vue"),
      excerpt: (): Promise<Component> => import("./widget-excerpt.vue"),
      cta: (): Promise<Component> => import("./widget-cta.vue")
    }
  }
}

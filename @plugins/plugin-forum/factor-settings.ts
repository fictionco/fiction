import { Component } from "vue"

export default {
  forum: {
    indexRoute: "/forum",
    postRoute: "/topic",
    limit: 10,
    returnLinkText: "All Topics",
    metatags: {
      index: {
        title: "Factor Forum",
        description: "Fiction forum topics."
      }
    },
    notFound: {
      title: "No Topics",
      subTitle: "Couldn't find any forum topics."
    },
    layout: {
      index: ["author", "title", "meta", "synopsis", "tags"],
      single: [
        "returnLink",
        "title",
        "meta",
        "author",
        "subtitle",
        "entry"
      ],
      meta: ["tags"]
    },
    components: {
      forumWrap: (): Promise<Component> => import("./forum-wrap.vue"),
      forumIndex: (): Promise<Component> => import("./forum-index.vue"),
      forumSingle: (): Promise<Component> => import("./forum-single.vue"),
      returnLink: (): Promise<Component> => import("./widget-return-link.vue"),
      title: (): Promise<Component> => import("./widget-title.vue"),
      meta: (): Promise<Component> => import("./widget-meta.vue"),
      synopsis: (): Promise<Component> => import("./widget-synopsis.vue"),
      pagination: (): Promise<Component> => import("./widget-pagination.vue"),
      author: (): Promise<Component> => import("./widget-author.vue"),
      entry: (): Promise<Component> => import("./widget-entry.vue"),
      tags: (): Promise<Component> => import("./widget-tags.vue")
    }
  }
}

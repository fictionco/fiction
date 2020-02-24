import { Component } from "vue"

export default {
  blog: {
    indexRoute: "/blog",
    postRoute: "/entry",
    limit: 10,
    returnLinkText: "All Posts",
    metatags: {
      index: {
        title: "Blog",
        description: "The latest news and articles."
      }
    },
    categories: ["uncategorized"],
    notFound: {
      title: "No Posts",
      subTitle: "Couldn't find any blog posts."
    },
    layout: {
      index: ["featuredImage", "title", "subtitle", "meta"],
      single: ["returnLink", "title", "meta", "subtitle", "entry", "social", "authorBio"],
      meta: ["authorDate", "tags"]
    },
    components: {
      blogWrap: (): Promise<Component> => import("./blog-wrap.vue"),
      blogIndex: (): Promise<Component> => import("./blog-index.vue"),
      blogSingle: (): Promise<Component> => import("./blog-single.vue"),
      returnLink: (): Promise<Component> => import("./widget-return-link.vue"),
      featuredImage: (): Promise<Component> => import("./widget-featured-image.vue"),
      title: (): Promise<Component> => import("./widget-title.vue"),
      meta: (): Promise<Component> => import("./widget-meta.vue"),
      subtitle: (): Promise<Component> => import("./widget-subtitle.vue"),
      pagination: (): Promise<Component> => import("./widget-pagination.vue"),
      authorDate: (): Promise<Component> => import("./widget-author-date.vue"),
      authorBio: (): Promise<Component> => import("./widget-author-bio.vue"),
      entry: (): Promise<Component> => import("./widget-entry.vue"),
      excerpt: (): Promise<Component> => import("./widget-excerpt.vue"),
      social: (): Promise<Component> => import("./widget-social.vue"),
      tags: (): Promise<Component> => import("./widget-tags.vue"),
      notFound: (): Promise<Component> => import("./widget-not-found.vue"),
      loading: (): Promise<Component> => import("./widget-loading.vue")
    }
  }
}

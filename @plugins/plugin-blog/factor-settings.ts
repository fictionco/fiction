import { Component } from "vue"

export default {
  blog: {
    indexRoute: "/blog",
    postRoute: "/entry",
    limit: 10,
    returnLinkText: "All Posts",
    metatags: {
      index: {
        title: "Fiction Essays - Building Apps, Code, Remote Work",
        description: "Fiction blog posts."
      }
    },
    notFound: {
      title: "No Posts",
      subTitle: "Couldn't find any blog posts."
    },
    layout: {
      index: ["featuredImage", "headers", "meta"],
      single: [
        "returnLink",
        "featuredImage",
        "headers",
        "meta",
        "entry",
        "social",
        "authorBio"
      ],
      meta: ["authorDate", "tags"]
    },
    components: {
      blogWrap: (): Promise<Component> => import("./blog-wrap.vue"),
      blogIndex: (): Promise<Component> => import("./blog-index.vue"),
      blogSingle: (): Promise<Component> => import("./blog-single.vue"),
      pagination: (): Promise<Component> => import("./widget-pagination.vue"),
      returnLink: (): Promise<Component> => import("./widget-return-link.vue"),
      authorDate: (): Promise<Component> => import("./widget-author-date.vue"),
      authorBio: (): Promise<Component> => import("./widget-author-bio.vue"),
      entry: (): Promise<Component> => import("./widget-entry.vue"),
      excerpt: (): Promise<Component> => import("./widget-excerpt.vue"),
      featuredImage: (): Promise<Component> => import("./widget-featured-image.vue"),
      headers: (): Promise<Component> => import("./widget-headers.vue"),
      meta: (): Promise<Component> => import("./widget-meta.vue"),
      social: (): Promise<Component> => import("./widget-social.vue"),
      tags: (): Promise<Component> => import("./widget-tags.vue")
    }
  }
}

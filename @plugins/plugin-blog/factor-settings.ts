import Vue from "vue"

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
      blogWrap: (): Promise<Vue> => import("./blog-wrap.vue"),
      blogIndex: (): Promise<Vue> => import("./blog-index.vue"),
      blogSingle: (): Promise<Vue> => import("./blog-single.vue"),
      pagination: (): Promise<Vue> => import("./widget-pagination.vue"),
      returnLink: (): Promise<Vue> => import("./widget-return-link.vue"),
      authorDate: (): Promise<Vue> => import("./widget-author-date.vue"),
      authorBio: (): Promise<Vue> => import("./widget-author-bio.vue"),
      entry: (): Promise<Vue> => import("./widget-entry.vue"),
      excerpt: (): Promise<Vue> => import("./widget-excerpt.vue"),
      featuredImage: (): Promise<Vue> => import("./widget-featured-image.vue"),
      headers: (): Promise<Vue> => import("./widget-headers.vue"),
      meta: (): Promise<Vue> => import("./widget-meta.vue"),
      social: (): Promise<Vue> => import("./widget-social.vue"),
      tags: (): Promise<Vue> => import("./widget-tags.vue")
    }
  }
}

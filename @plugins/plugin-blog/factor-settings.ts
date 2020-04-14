export default {
  blog: {
    indexRoute: "/blog",
    postRoute: "/entry",
    limit: 10,
    returnLinkText: "All Posts",
    metatags: {
      index: {
        title: "Blog",
        description: "The latest news and articles.",
      },
    },
    categories: ["uncategorized"],
    notFound: {
      title: "No Posts",
      subTitle: "Couldn't find any blog posts.",
    },
    layout: {
      index: ["featuredImage", "title", "subtitle", "meta"],
      single: ["returnLink", "title", "meta", "subtitle", "entry", "social", "authorBio"],
      meta: ["authorDate", "tags"],
    },
    components: {
      blogWrap: (): Promise<any> => import("./blog-wrap.vue"),
      blogIndex: (): Promise<any> => import("./blog-index.vue"),
      blogSingle: (): Promise<any> => import("./blog-single.vue"),
      returnLink: (): Promise<any> => import("./widget-return-link.vue"),
      featuredImage: (): Promise<any> => import("./widget-featured-image.vue"),
      title: (): Promise<any> => import("./widget-title.vue"),
      meta: (): Promise<any> => import("./widget-meta.vue"),
      subtitle: (): Promise<any> => import("./widget-subtitle.vue"),
      pagination: (): Promise<any> => import("./widget-pagination.vue"),
      authorDate: (): Promise<any> => import("./widget-author-date.vue"),
      authorBio: (): Promise<any> => import("./widget-author-bio.vue"),
      entry: (): Promise<any> => import("./widget-entry.vue"),
      excerpt: (): Promise<any> => import("./widget-excerpt.vue"),
      social: (): Promise<any> => import("./widget-social.vue"),
      tags: (): Promise<any> => import("./widget-tags.vue"),
      notFound: (): Promise<any> => import("./widget-not-found.vue"),
      loading: (): Promise<any> => import("./widget-loading.vue"),
    },
  },
}

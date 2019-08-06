module.exports.default = Factor => {
  return {
    blog: {
      components: {
        blogFeaturedImage: () => import("./blog/featured-image.vue"),
        blogTags: () => import("./blog/tags.vue"),
        blogDate: () => import("./blog/date.vue"),
        blogHeaders: () => import("./blog/headers.vue"),
        blogExcerpt: () => import("./blog/excerpt.vue"),
        blogAuthor: () => import("./blog/author.vue"),
        blogSingle: () => import("./blog/single.vue"),
        blogIndex: () => import("./blog/index.vue"),
        blogContent: () => import("./blog/wrap.vue")
      },
      layout: {
        index: [
          "blogFeaturedImage",
          "blogTags",
          "blogDate",
          "blogHeaders",
          "blogExcerpt",
          "blogAuthor"
        ],
        single: [
          "blogFeaturedImage",
          "blogMeta",
          "returnLink",
          "blogHeaders",
          "entry",
          "social",
          "authorBio"
        ],
        meta: ["authorDate", "tags"]
      }
    }
  }
}

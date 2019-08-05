module.exports.default = Factor => {
  return {
    blog: {
      components: {
        blogContent: () => import("./blog/wrap.vue"),
        customImage: () => import("./blog/custom.vue")
      },
      layout: {
        index: ["customImage", "headers", "excerpt", "meta"],
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
      }
    }
  }
}

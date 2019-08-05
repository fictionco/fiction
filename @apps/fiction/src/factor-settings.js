module.exports.default = Factor => {
  return {
    blog: {
      components: {
        blogContent: () => import("./blog/wrap.vue")
      },
      layout: {
        index: ["headers", "excerpt", "meta"],
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

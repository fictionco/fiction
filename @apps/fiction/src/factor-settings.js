module.exports.default = Factor => {
  return {
    contactForm: {
      email: "andrew@fiction.com"
    },
    blog: {
      components: {
        blogFeaturedImage: () => import("./blog/featured-image.vue"),
        blogHeaders: () => import("./blog/headers.vue"),
        blogSingleHeaders: () => import("./blog/single-headers.vue"),
        returnLink: () => import("./blog/return-link.vue"),
        blogExcerpt: () => import("./blog/excerpt.vue"),
        blogMeta: () => import("./blog/meta.vue"),
        blogSingle: () => import("./blog/single.vue"),
        blogIndex: () => import("./blog/index.vue"),
        blogContent: () => import("./blog/wrap.vue")
      },
      layout: {
        index: ["blogFeaturedImage", "blogHeaders", "blogExcerpt", "blogMeta"],
        single: [
          "blogSingleHeaders",
          "blogFeaturedImage",
          "blogMeta",
          "entry",
          "social",
          "authorBio"
        ],
        meta: ["authorDate", "tags"]
      }
    },
    jobs: {
      indexRoute: "/careers",
      postRoute: "/careers",
      limit: 10,
      metatags: {
        index: {
          title: "Fiction Careers - Building Apps, Code, Remote Work",
          description: "Fiction Careers."
        }
      }
      // components: {
      //   jobsIndex: () => import("./jobs/index.vue")
      // }
      // layout: {
      //   index: ["headers", "excerpt"],
      //   single: ["singleHeaders", "featuredImage", "entry", "cta"]
      // }
    }
  }
}

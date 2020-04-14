export default {
  app: {
    url: "https://www.fiction.com",
  },
  emailList: {
    alphaProgram: {
      tags: ["fiction-com"],
      form: {
        buttonText: "Apply for Dev Program &rarr;",
      },
    },
  },
  blog: {
    indexRoute: "/blog",
    postRoute: "/entry",
    limit: 6,
    returnLinkText: "Back",
    components: {
      blogIndex: (): Promise<any> => import("./blog/blog-index.vue"),
      blogSingle: (): Promise<any> => import("./blog/blog-single.vue"),
      featuredImage: (): Promise<any> => import("./blog/el-featured-image.vue"),
      customSingleHeader: (): Promise<any> => import("./blog/el-single-header.vue"),
    },
    layout: {
      index: ["title", "subtitle", "meta"],
      single: ["customSingleHeader", "meta", "entry", "social", "authorBio"],
      meta: ["authorDate", "tags"],
    },
  },
  jobs: {
    indexRoute: "/careers",
    postRoute: "/careers",
    limit: 6,
    returnLinkText: "All Jobs",
    metatags: {
      index: {
        title: "Fiction Jobs - Building Apps, Code, Remote Work",
        description: "Fiction jobs.",
      },
    },
    notFound: {
      title: "No Posts",
      subTitle: "Couldn't find any job posts.",
    },
    layout: {
      index: ["featuredImage", "title", "synopsis"],
      single: ["singleHeader", "entry", "cta"],
    },
    components: {
      jobsWrap: (): Promise<any> => import("./jobs/wrap.vue"),
      jobsIndex: (): Promise<any> => import("./jobs/index.vue"),
      jobsSingle: (): Promise<any> => import("./jobs/single.vue"),
      singleHeader: (): Promise<any> => import("./jobs/single-header.vue"),
      cta: (): Promise<any> => import("./jobs/cta.vue"),
    },
  },
}

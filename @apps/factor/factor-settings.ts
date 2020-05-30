import docNav from "../../@docs/_nav"
import injectedComponents from "../../@docs/_components"
export default {
  docsEngine: {
    nav: docNav,
    components: injectedComponents,
  },
  subscriptions: {
    publishableKey: {
      production: "pk_live_mNp1P1HlMMP4gxpc0aUMuayE",
      development: "pk_test_jbW9mKYjd1PXtJklKiqJtIq4",
    },
    products: [
      {
        slug: "pro",
        title: "Pro Suite",
        description: "Pro Features and Extensions",
        plans: [
          {
            interval: "year",
            production: "plan_HLstnnRlMqX9EU",
            development: "plan_HDjUY9NRtVTaND",
          },
          {
            interval: "month",
            production: "plan_HLsuiVVFaZJ8Hy",
            development: "plan_HDjUeyfZxz6vJD",
          },
        ],
      },
      {
        slug: "business",
        title: "Business Suite",
        description: "Pro plus additional business enhancements",
        plans: [
          {
            interval: "year",
            production: "plan_HLsrwfVGN72lgI",
            development: "plan_HDjVkmq9Hlpr5p",
          },
          {
            interval: "month",
            production: "plan_HLss5bGKAIfuXs",
            development: "plan_HDjVyDXlswZYDP",
          },
        ],
      },
    ],
  },
  forum: {
    title: "Factor Forum",
    notify: {
      newTopic: ["andrew@fiction.com"],
      newReply: ["andrew@fiction.com"],
    },
    categories: ["support", "plugins", "themes", "showcase", "feedback", "integrations"],
    metatags: {
      index: {
        title: "Factor Forum",
        description: "Help and discussion about Factor JS",
      },
    },
  },
  app: { url: "https://factor.dev" },
  metaInfo: {
    default: {
      image: require("./src/static/factor-logo.jpg"),
    },
  },

  emailList: {
    alphaProgram: { tags: ["factor-dev"] },
  },
  site: {
    logo: (): Promise<any> => import("./src/el/logo-factor.vue"),
  },
  blog: {
    title: "Factor Blog",
    content: "Build successful apps.",
    indexRoute: "/blog",
    postRoute: "/entry",
    limit: 6,
    returnLinkText: "Back",
    notFound: {
      title: "No Posts",
      subTitle: "Couldn't find any blog posts.",
    },
    categories: ["releases", "tutorials", "how-to", "company", "showcase"],
    promo: {
      pretitle: "The JavaScript CMS",
      title: "Build something incredible today",
      content: "Factor will help you launch websites and applications faster.",
      button: {
        link: "/install",
        text: "Install Factor",
      },
    },
    metatags: {
      index: {
        title: "Factor Blog",
        description: "The latest news and articles.",
      },
    },
    components: {
      blogIndex: (): Promise<any> => import("./src/blog/blog-index.vue"),
      blogSingle: (): Promise<any> => import("./src/blog/blog-single.vue"),
      featuredImage: (): Promise<any> => import("./src/blog/el-featured-image.vue"),
      title: (): Promise<any> => import("./src/blog/widget-title.vue"),
      date: (): Promise<any> => import("./src/blog/widget-date.vue"),
      author: (): Promise<any> => import("./src/blog/widget-author.vue"),
      singleHeader: (): Promise<any> => import("./src/blog/el-single-header.vue"),
      entry: (): Promise<any> => import("./src/blog/widget-entry.vue"),
      social: (): Promise<any> => import("./src/blog/widget-social.vue"),
      pagination: (): Promise<any> => import("./src/blog/widget-pagination.vue"),
    },
    layout: {
      index: ["featuredImage", "date", "title", "author"],
      single: ["singleHeader", "entry", "social"],
    },
  },
  jobs: {
    indexRoute: "/careers",
    postRoute: "/careers",
    limit: 6,
    returnLinkText: "All Jobs",
    metatags: {
      index: {
        title: "Factor Jobs - Building Apps, Code, Remote Work",
        description: "Factor jobs.",
      },
    },
    notFound: {
      title: "No Posts",
      subTitle: "Couldn't find any job posts.",
    },
    layout: {
      index: ["title"],
      single: ["singleHeader", "entry", "cta"],
    },
    components: {
      jobsWrap: (): Promise<any> => import("./src/jobs/wrap.vue"),
      jobsIndex: (): Promise<any> => import("./src/jobs/index.vue"),
      jobsSingle: (): Promise<any> => import("./src/jobs/single.vue"),
      title: (): Promise<any> => import("./src/jobs/widget-title-override.vue"),
      singleHeader: (): Promise<any> => import("./src/jobs/single-header.vue"),
      cta: (): Promise<any> => import("./src/jobs/cta.vue"),
    },
  },
  plugins: {
    cta: {
      title: "Create and Submit Your Plugin",
      subtitle:
        "Learn about extension development and how to submit your extension to the Factor library.",
    },
  },
  footer: {
    legal:
      "&copy; 2020 <a href='https://www.fiction.com'>Fiction.com</a> Inc. Released under the GPL-2 License.",
  },
}

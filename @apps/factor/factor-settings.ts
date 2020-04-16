import docNav from "../../@docs/_nav"
import docNavOld from "../../@docs-old/_nav-old"

export default {
  docsEngine: {
    nav: process.env.NODE_ENV == "production" ? docNavOld : docNav,
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
    content: "Learn coding tips and tricks. Get updates, build successful apps.",
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

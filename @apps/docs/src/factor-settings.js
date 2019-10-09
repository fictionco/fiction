module.exports.default = Factor => {
  return {
    metaInfo: {
      default: {
        image: require("./static/factor-logo.jpg")
      }
    },
    emailList: {
      alphaProgram: {
        tags: ["factor-dev"]
      }
    },
    docs: {
      pages: [
        {
          group: "Getting Started"
        },
        {
          doc: "",
          name: "Introduction",
          file: require("./docs/intro.md"),
          title: "Introduction: Why Use Factor"
        },
        {
          doc: "framework-comparison",
          name: "Compare",
          file: require("./docs/compare.md"),
          title: "Comparing Web App Frameworks"
        },
        {
          doc: "quickstart",
          title: "Installation and Quickstart",
          description:
            "Quick start guide on how to install Factor framwork and Vue CMS in less than 5 minutes.",
          file: require("./docs/quickstart.md")
        },
        {
          doc: "dashboard-setup",
          file: require("./docs/dashboard/setup.md"),
          title: "Setting Up the Dashboard and CMS"
        },

        {
          group: "App Development"
        },
        {
          name: "File Structure",
          doc: "file-structure",
          file: require("./docs/structure.md"),
          title: "Factor File Structure"
        },
        {
          name: "Add Extensions",
          doc: "extension-basics",
          file: require("./docs/extension-basics.md"),
          title: "Using Plugins / Themes"
        },

        {
          doc: "customize",
          file: require("./docs/customize.md"),
          title: "Customize Factor Plugins and Themes"
        },

        {
          doc: "config",
          name: "Config",
          file: require("./docs/config.md"),
          title: "Factor Config and Setup CLI"
        },
        {
          doc: "pages",
          file: require("./docs/pages.md"),
          title: "Pages and Page Templates"
        },
        {
          doc: "cli",
          name: "Use the CLI",
          file: require("./docs/cli.md"),
          title: "Using Factor CLI and Creating Custom Commands"
        },
        {
          doc: "filters",
          file: require("./docs/framework/filters.md"),
          title: "Factor Filters and Callbacks API"
        },
        {
          doc: "routes-and-stores",
          file: require("./docs/framework/routes-stores.md"),
          title: "Configuring Routes and Stores"
        },
        {
          doc: "meta",
          file: require("./docs/meta.md"),
          title: "Setting Meta and Metatags"
        },

        {
          name: "Server and Endpoints",
          doc: "server",
          file: require("./docs/server.md"),
          title: "Using Server Side Rendering (SSR)"
        },

        {
          name: "Hosting Your App",
          doc: "serving",
          file: require("./docs/hosting.md"),
          title: "Hosting and Serving Your Factor App"
        },

        {
          group: "Extension Development"
        },

        {
          doc: "create-plugins",
          file: require("./docs/creating-plugins.md"),
          title: "Using and Creating Factor Themes"
        },
        {
          doc: "create-themes",
          file: require("./docs/creating-themes.md"),
          title: "Using and Creating Factor Themes"
        },
        {
          name: "Working With Posts",
          doc: "post-system",
          file: require("./docs/posts.md"),
          title: "Working with Posts"
        },
        {
          name: "Extend The Dashboard",
          doc: "extend-dashboard",
          file: require("./docs/dashboard.md"),
          title: "Extending the Factor Dashboard"
        },
        {
          name: "Extend the CLI",
          doc: "extend-the-CLI",
          file: require("./docs/cli-dev.md"),
          title: "Extending the Factor CLI"
        },

        {
          group: "Contributing"
        },
        {
          name: "Contribution Guidelines",
          doc: "contribution",
          file: require("./docs/contribution.md"),
          title: "Contributing Guidelines"
        },

        {
          name: "Philosophy and Style",
          doc: "philosophy",
          file: require("./docs/philosophy.md"),
          title: "Factor Philosophy"
        },
        {
          group: "Reference"
        },
        {
          doc: "filter-reference",
          file: require("./docs/filter-reference.md"),
          title: "Factor Filters Reference"
        }
      ],
      base: "guide"
    },
    site: {
      logo: () => import("./el/logo-factor"),
      nav: [
        {
          path: "/guide",
          name: "Development Guide"
        },
        {
          path: "/themes",
          name: "Themes"
        },
        {
          path: "/plugins",
          name: "Plugins"
        },

        {
          path: "https://github.com/fiction-com/factor",
          name: "Github",
          icon: "github",
          target: "_blank"
        },
        {
          event: "signin-modal",
          name: "Sign In &rarr;",
          condition: () => !Factor.$user.isLoggedIn()
        },
        {
          component: () => Factor.$components["plugin-signin-profile-menu"],
          condition: () => Factor.$user.isLoggedIn()
        }
      ]
    },
    plugins: {
      indexRoute: "/pluginsnew", //indexRoute: "/blog"
      postRoute: "/plugin", //postRoute: "/entry"
      limit: 10,
      layout: {
        index: () => import("./plugins/v-plugins.vue"),
        single: () => import("./plugins/plugins-single.vue")
      }
      // components: {
      //   blogWrap: () => import("./blog/blog-wrap.vue"),
      //   blogIndex: () => import("./blog/blog-index.vue"),
      //   blogSingle: () => import("./blog/blog-single.vue"),
      //   blogFeaturedImage: () => import("./blog/el-featured-image.vue"),
      //   blogHeaders: () => import("./blog/el-headers.vue"),
      //   blogReturnLink: () => import("./blog/el-return-link.vue"),
      //   blogExcerpt: () => import("./blog/el-excerpt.vue"),
      //   blogMeta: () => import("./blog/el-meta.vue")
      // },
      // layout: {
      //   index: ["blogFeaturedImage", "blogHeaders", "blogExcerpt", "blogMeta"],
      //   single: [
      //     "blogHeaders",
      //     "blogFeaturedImage",
      //     "blogMeta",
      //     "entry",
      //     "social",
      //     "authorBio"
      //   ],
      //   meta: ["authorDate", "tags"]
      // }
    },

    footer: {
      headline: "Released under the GPL-2 License",
      legal: "Copyright &copy; - <a href='https://www.fiction.com'>Fiction.com</a>",
      logo: () => import("./el/logo-fiction"),
      logo2: () => import("./el/logo-pagelines")
    }
  }
}

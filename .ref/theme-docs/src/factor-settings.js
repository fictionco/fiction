export default Factor => {
  return {
    docs: {
      pages: [
        {
          doc: "",
          title: "Intro Page",
          name: "Intro",
          file: require("./docs/intro/index.md")
        },
        {
          group: "Examples"
        },
        {
          doc: "example",
          title: "Example Page",
          description: "An example docs page.",
          file: require("./docs/example/index.md")
        },
        {
          doc: "example2",
          title: "Example Page",
          description: "An example docs page.",
          file: require("./docs/example/example2.md")
        },
        {
          doc: "example3",
          title: "Example Page",
          description: "An example docs page.",
          file: require("./docs/example/example3.md")
        }
      ],
      base: "docs"
    },
    site: {
      logo: () => import("./el/logo-factor.vue"),
      nav: [
        {
          path: "/docs",
          name: "Docs"
        },

        {
          path: "https://gitter.im/factorjs/community",
          name: "Community",
          icon: "gitter"
        },
        {
          path: "https://github.com/fiction-com/factor",
          name: "Github",
          icon: "github"
        }
      ]
    },

    footer: {
      headline: "Footer Headline",
      legal: "Copyright &copy; 2017-2019 Your Company, Inc.",
      logo: () => import("./el/logo-fiction")
    }
  }
}

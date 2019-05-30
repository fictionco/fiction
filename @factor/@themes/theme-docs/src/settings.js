export default {
  docs: {
    pages: [
      {
        doc: "",
        title: "Intro Page",
        name: "Intro",
        file: require("./docs/intro/index.md")
      },
      {
        doc: "example",
        title: "Example Page",
        description: "An example docs page.",
        file: require("./docs/example/index.md")
      }
    ],
    base: "docs"
  },
  site: {
    logo: () => import("./el/logo-factor"),
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
  },
  home: {
    meta: {
      title: "Docs Theme - Factor.js",
      description: "A simple documentation theme for Factor.js framework."
    },

    headline: "Factor Docs Theme",
    subHeadline: "A markdown based documentation theme for Factor",
    boxes: [
      {
        title: "Simple",
        description:
          "People love simplicity! All you need to do for a fully working docs site (with SSR) is to add your markdown docs."
      },
      {
        title: "Markdown",
        description:
          "The standard in writing docs. No messing with editors or other problematic formats. Use markdown files."
      },
      {
        title: "Tools",
        description:
          "This theme includes tools for syntax highlighting with PrismJS and automatically generating your docs table-of-contents."
      }
    ],
    actions: [
      {
        btn: "primary",
        path: "/docs/quickstart",
        text: "Get Started"
      },
      {
        btn: "tertiary",
        path: "/docs",
        text: "Read the Docs"
      }
    ]
  }
}

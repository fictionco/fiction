export default {
  docs: {
    pages: [
      {
        doc: "quickstart",
        title: "Installation and Quickstart",
        description: "Quick start guide on how to install Factor framwork and Vue CMS in less than 5 minutes.",
        file: require("./docs/installation/index.md")
      },
      {
        doc: "",
        name: "Introduction",
        file: require("./docs/introduction/index.md"),
        title: "Introduction: Why Use Factor"
      },
      {
        doc: "factor-framework",
        name: "Framework",
        file: require("./docs/framework/index.md"),
        title: "Factor's VueJS Framework - Routes, Stores, Views"
      },
      {
        doc: "cli",
        name: "Commands",
        file: require("./docs/cli/index.md"),
        title: "Using Factor CLI and Creating Custom Commands"
      },
      {
        doc: "filters",
        name: "Filters",
        file: require("./docs/filters/index.md"),
        title: "Factor Filters and Callbacks API"
      }
      // {
      //   doc: "hosting-and-deployment",
      //   file: require("./docs/hosting/index.md"),
      //   title: "Hosting and Deploying Your App"
      // }
    ],
    base: "guide"
  },
  site: {
    logo: () => import("./el/logo-factor"),
    nav: [
      {
        path: "/guide",
        name: "Guide"
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
    headline: "Released under the GPLv3 License",
    legal: "Copyright &copy; 2017-2019 Fiction.com, Inc.",
    logo: () => import("./el/logo-fiction")
  },
  home: {
    meta: {
      title: "Factor.js - Web App OS",
      description:
        "Factor is a modern serverless CMS based on Vue.js that helps developers build blazing fast websites and apps."
    },

    headline: "Build Beautiful Web Apps",
    subHeadline:
      "Factor is free and open-source Javascript platform for creating cutting-edge websites, blogs, or apps.",
    boxes: [
      {
        title: "Extension First",
        description:
          "From the ground up built for extensibility. Add features with plugins, services with stacks, UI with themes."
      },
      {
        title: "Posts and Pages",
        description:
          "Similar to WordPress, Factor has an (optional) dashboard and posts-system for managing common tasks."
      },
      {
        title: "Ship Faster",
        description:
          "Finally the JS world has a platform designed to help you ship production apps. Use Factor and stop the frustration."
      }
    ],
    actions: [
      {
        btn: "primary",
        path: "/guide/quickstart",
        text: "Get Started"
      },
      {
        btn: "tertiary",
        path: "/guide",
        text: "Read the Docs"
      }
    ]
  }
}

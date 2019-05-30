export default {
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
  },
  docsBase: "guide",
  docs: []
}

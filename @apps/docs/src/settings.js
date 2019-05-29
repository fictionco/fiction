export default {
  siteTitle: "Test",
  basePath: "guide",
  docs: [
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
    }
  ],
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
}

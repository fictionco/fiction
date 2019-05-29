export default {
  siteTitle: "Test",
  docsBase: "guide",
  docs: [
    {
      id: "installation",
      title: "Installing Factor Framework and CMS",
      description: "Quick start guide on how to install Factor framwork and Vue CMS in less than 5 minutes.",
      file: require("./installation/index.md")
    },
    {
      id: "introduction",
      route: "/guide",
      file: require("./introduction/index.md"),
      title: "Introduction: Why Use Factor"
    },

    {
      id: "plugins",
      file: require("./plugins/index.md"),
      title: "Add Factor Plugins or Create Your Own"
    },
    {
      name: "Routing and Views",
      id: "routing",
      file: require("./installation/index.md"),
      title: "Creating Custom Routes and View Components"
    },
    {
      name: "Configuration and Setup",
      id: "configuration",
      file: require("./installation/index.md")
    }
  ]
}

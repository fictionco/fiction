const downloadBase = "https://minhaskamal.github.io/DownGit/#/home?url="

export default {
  themes: [
    {
      name: "Docs",
      description: "A simple documentation theme also used on Factor's docs.",
      category: "documentation",
      tags: "docs, markdown, simple, clean",
      author: {
        name: "Fiction",
        icon: "fiction",
        url: "https://www.fiction.com"
      },
      github: "https://github.com/fiction-com/factor/tree/master/%40factor/%40themes/theme-docs",
      pkg: `@factor/theme-docs`,
      screenshot: require("./theme-docs/screenshot.jpg"),
      demo: "https://docs-theme.factor.dev/",
      price: "free"
    }
  ]
}

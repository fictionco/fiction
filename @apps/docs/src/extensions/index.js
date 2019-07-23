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
    },
    {
      name: "Alpha",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions.",
      category: "portfolio",
      tags: "portfolio, creative, clean, business",
      author: {
        name: "Fiction",
        icon: "fiction",
        url: "https://www.fiction.com"
      },
      github: "https://github.com/fiction-com/factor/tree/master/%40factor/%40themes/theme-alpha",
      pkg: `@factor/theme-alpha`,
      screenshot: require("./theme-alpha/screenshot.jpg"),
      demo: "https://alpha-theme.factor.dev/",
      price: "free"
    },
    {
      name: "Bulma",
      description: "Theme Bulma makes using the open source CSS framework with Factor a breeze.",
      category: "product",
      tags: "bulma, agency, corporate, business",
      author: {
        name: "Fiction",
        icon: "fiction",
        url: "https://www.fiction.com"
      },
      github: "https://github.com/fiction-com/factor/tree/master/%40factor/%40themes/theme-bulma",
      pkg: `@factor/theme-bulma`,
      screenshot: require("./theme-bulma/screenshot.jpg"),
      demo: "https://bulma-theme.factor.dev/",
      price: "free"
    }
  ]
}

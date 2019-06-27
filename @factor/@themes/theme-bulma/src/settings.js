module.exports = Factor => {
  return {
    site: {
      logo: () => import("./el/logo-bulma"),
      nav: [
        {
          path: "/",
          name: "Home"
        },
        {
          path: "/elements",
          name: "Elements"
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

export default Factor => {
  return {
    app: {
      error404: () => import("#/404.vue"),
      content: () => import("#/content.vue"),
      site: () => import("#/site.vue"),
      templatePath: Factor.$paths.resolveFilePath("#/index.html"),
      faviconPath: Factor.$paths.resolveFilePath("#/static/favicon.png"),
      icon: require("./icon.png")
    }
  }
}

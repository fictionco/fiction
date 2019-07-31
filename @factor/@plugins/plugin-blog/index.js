export default Factor => {
  return new (class {
    constructor() {
      this.filters()
    }

    filters() {
      const baseRoute = Factor.$setting.get("blog.baseRoute")

      Factor.$filters.add("post-types", _ => {
        _.push({
          postType: "blog",
          baseRoute,
          icon: require("./img/posts.svg"),
          model: "BlogPost",
          nameIndex: "Blog",
          nameSingle: "Blog Post",
          namePlural: "Blog Posts"
        })

        return _
      })
    }
  })()
}

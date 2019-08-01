module.exports.default = Factor => {
  return {
    blog: {
      indexRoute: "/blog",
      baseRoute: "/entry",
      metatags: {
        index: {
          title: "Fiction Essays - Building Apps, Code, Remote Work",
          description: "Fiction blog posts."
        }
      },
      notFound: {
        title: "No Posts",
        subTitle: "Couldn't find any blog posts."
      }
    }
  }
}

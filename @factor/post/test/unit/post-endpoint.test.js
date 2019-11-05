describe("post-endpoint", () => {
  describe("create/update/save", () => {
    it.todo("uses correct post type model")
    it.todo("saves posts with existing _id")
    it.todo("creates new posts if _id isn't provided")
    it.todo("checks schema permissions before creating new posts")
    it.todo("checks schema permissions before updating posts")
    it.todo("allows many posts to be updated at once")
    it.todo("checks permissions on all posts before updating")
  })
  describe("deletion", () => {
    it.todo("allow deletion of a single post")
    it.todo("verifies permissions before deleting post")
  })
  describe("get index", () => {
    it.todo("get list of posts")
    it.todo("get index of posts with populated info based on schema")
    it.todo("get index meta info and return with index query")
  })

  describe("get single post", () => {
    it.todo("get single post based on _id")
    it.todo("get single post based on query conditions")
    it.todo("if JWT token is passed, convert it to a post _id and get it")
    it.todo("check publication status and return only if appropriate")
  })
  describe("join/population", () => {
    it.todo("loads array of post in single 'population' query")
  })
})

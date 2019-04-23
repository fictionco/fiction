export default Factor => {
  return new (class {
    constructor() {
      this.filters()
    }

    filters() {
      Factor.$filters.add("content-routes-unmatched", _ => {
        _.unshift({
          path: "/@:username",
          component: () => import("./profile")
        })

        return _
      })

      Factor.$filters.add("post-params", params => {
        const { username } = params
        if (username) {
          params = {
            ...params,
            permalink: username,
            field: "username"
          }
        }
        return params
      })
    }
  })()
}

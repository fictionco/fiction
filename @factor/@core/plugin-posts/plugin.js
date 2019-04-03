export default Factor => {
  return new class {
    constructor() {
      this.filters()

      this.initialized = false
    }

    filters() {
      Factor.$filters.add("components", _ => {
        _["factor-post-edit"] = () => import("./el/edit-link")
        return _
      })

      Factor.$filters.add("dashboard-routes", _ => {
        _.push({
          path: "posts",
          component: () => import("./vd-posts-dashboard")
        })

        _.push({
          path: "posts/edit",
          component: () => import("./vd-posts-edit")
          // meta: { activePath: "/admin/posts" }
        })

        _.push({
          path: "posts/:postType/edit",
          component: () => import("./vd-posts-edit")
          //meta: { activePath: "/admin/posts" }
        })

        _.push({
          path: "posts/:postType/add-new",
          component: () => import("./vd-posts-edit"),
          meta: {}
        })

        _.push({
          path: "posts/:postType",
          component: () => import("./vd-posts-dashboard"),
          meta: {}
        })

        return _
      })

      // Assign Post Info to Route
      // Has to happen after all initialized
      Factor.$filters.add("mixins", _ => {
        //_.post = this.addPostToComponents()

        return _
      })

      // Add page templates
      Factor.$filters.add("register-components", _ => {
        _["templates"] = this.registerTemplates()
        return _
      })

      Factor.$filters.add("stores", _ => {
        _["posts"] = require("./store").default
        return _
      })

      const setPost = (_, to = null) => {
        const route = to || Factor.$router.currentRoute

        const _promise = async () => {
          let parts
          const { permalink } = route.params
          let post = {}
          if (permalink) {
            post = await this.getPostByPermalink(permalink)

            if (post) {
              const { type } = post

              parts = { type, permalink }
            }
          } else {
            parts = { path: route.fullPath }
          }

          Factor.$store.commit("setItem", { item: "post", value: post })

          // if (Factor.$ssrContext) {
          //   Factor.$ssrContext.metatags = this.getMetatags({ post, parts })
          // }

          return
        }

        _.push(_promise())

        return _
      }

      Factor.$filters.add("request-post", setPost)
      Factor.$filters.add("site-route-promises", setPost)

      Factor.$filters.add("dashboard-menu", _ => {
        this.getPostTypes().forEach(({ type, base, namePlural, icon = "" }) => {
          _.push({
            group: type,
            path: `posts/${type}`,
            name: namePlural || Factor.$utils.toLabel(type),
            icon,
            items: Factor.$filters.apply(`dashboard-menu-post-${type}`, [
              {
                path: "add-new",
                name: "Add New"
              },
              {
                path: "edit"
              }
            ])
          })
        })

        return _
      })
    }

    addPostToComponents() {
      return () => {
        Factor.mixin({
          computed: {
            $post() {
              return this.current()
            }
          }
        })
      }
    }

    current() {
      return this.$store.getters["getItem"]("post") || {}
    }

    init(cb) {
      if (this.initialized) {
        cb()
      } else {
        Factor.$events.$on("postInit", () => {
          this.initialized = true
          cb()
        })
      }
    }

    getMetatags({ post = {}, parts }) {
      const metatags = {}

      const canonical = this.getPermalink(parts)

      const title = post.titleTag || post.title || ""
      const description = post.description || this.excerpt(post.content) || ""
      const image = post.featuredImage
        ? post.featuredImage[0].url
        : post.images
        ? post.images[0].url
        : ""

      return { canonical, title, description, image }
    }

    async getPostIndex(args) {
      const { limit = 100, storeKey = "postIndex", page = 1 } = args

      const taxonomies = ["type", "tag", "category", "status"]

      const filters = taxonomies
        .filter(_ => args[_])
        .map(_ => {
          return {
            field: _,
            value: args[_]
          }
        })

      const query = { collection: "public", limit, filters, page }

      const results = await Factor.$db.search(query)

      results.posts = await this.parsePosts(results.data)

      Factor.$store.commit("setItem", {
        item: storeKey,
        value: results
      })

      return results
    }

    async parsePosts(posts) {
      if (!posts || posts.length == 0) {
        return []
      }

      const _promises = posts.reverse().map(async p => {
        let authorData = []
        if (p && p.authors && Array.isArray(p.authors) && p.authors.length > 0) {
          const _authorPromises = p.authors.map(async uid => {
            return await Factor.$user.request(uid)
          })
          authorData = await Promise.all(_authorPromises)
        }
        return { ...p, authorData }
      })

      return await Promise.all(_promises)
    }

    // Register Page Templates added by theme or app
    registerTemplates() {
      this.pageTemplates = this.getPageTemplates()

      Factor.$filters.add("components", _ => {
        this.pageTemplates.forEach(tpl => {
          _[tpl.value] = tpl.component
        })

        return _
      })
    }

    getPageTemplates() {
      return Factor.$filters.apply("page-templates", []).map(_ => {
        const name = _.name || Factor.$utils.toLabel(_.value.replace("page-template", ""))
        return {
          name,
          ..._
        }
      })
    }

    getPostTypes() {
      const initialPostTypes = [
        {
          type: "page",
          base: "",
          icon: require("./img/pages.svg"),
          nameIndex: "Pages",
          nameSingle: "Page",
          namePlural: "Pages"
        }
      ]

      return Factor.$filters.apply("post-types", initialPostTypes).map(_ => {
        return {
          base: typeof _.base == "undefined" ? _.type : _.base,
          nameIndex: Factor.$utils.toLabel(_.type),
          nameSingle: Factor.$utils.toLabel(_.type),
          namePlural: Factor.$utils.toLabel(_.type),
          ..._
        }
      })
    }

    postTypeInfo(postType) {
      const postTypes = this.getPostTypes()

      return postTypes.find(pt => pt.type == postType)
    }

    getPermalink({ type, permalink = "", root = true, path = false } = {}) {
      const parts = []

      parts.push(root ? Factor.$config.url : "")

      if (path) {
        parts.push(path)
        return parts.join("").replace(/\/$/, "") // remove trailing backslash
      } else {
        if (type) {
          const pt = this.getPostTypes().find(_ => _.type == type)

          const base = pt ? pt.base : false

          if (base) {
            parts.push(base)
          }
        }

        parts.push(permalink)

        return parts.join("/")
      }
    }

    getStatus(statusNumber) {
      const statusList = [
        { name: "Published", value: 1 },
        { name: "Draft", value: 0 },
        { name: "Archive", value: -2 }
      ]
      const item = statusList.find(_ => {
        return _.value == statusNumber
      })

      return item.name
    }

    async startPost(type) {
      const uid = Factor.$user.uid()

      if (!uid) {
        throw new Error("Can't create post without a logged in user.")
      } else if (!type) {
        throw new Error("Specify a type of post to create.")
      }

      const author = { [Factor.$user.uid()]: true }

      return {
        type,
        id: Factor.$uniqId(),
        author
      }
    }

    async getPostById(id) {
      return await Factor.$db.read({
        collection: "public",
        id
      })
    }

    async getPostByPermalink(permalink) {
      2
      const post = await Factor.$db.read({
        collection: "public",
        field: `permalink`,
        value: permalink
      })

      const { authors } = post || {}

      let _promises = []
      if (authors && Array.isArray(authors) && authors.length > 0) {
        _promises = authors.map(async uid => {
          return await Factor.$user.request(uid)
        })
      }

      // const flameQuery = {
      //   table: "posts",
      //   id: post.id,
      //   query: {
      //     table: "meta",
      //     id: "flames"
      //   }
      // }

      const [authorData] = await Promise.all([
        // Factor.$db.query(flameQuery),
        Promise.all(_promises)
      ])

      post.authorData = authorData
      // post.flames = Object.keys(flames).length

      return post
    }

    // Limit saved revisions to 20 and one per hour after first hour
    _cleanRevisions(revisions = []) {
      let counter

      const cleanedRevisions = revisions
        .filter(rev => {
          if (
            counter &&
            rev.timestamp > counter - 3600 &&
            rev.timestamp < Factor.$time.stamp() - 3600
          ) {
            return false
          } else {
            counter = rev.timestamp
            return true
          }
        })
        .slice(0, 20)

      return cleanedRevisions
    }

    // Save revisions to post
    // This should be merged into existing post (update)
    async saveDraft({ id, revisions }) {
      const data = {
        revisions: this._cleanRevisions(revisions)
      }
      const query = {
        collection: "public",
        data,
        id,
        merge: true,
        noIndex: true // no query/search changes
      }

      const response = await Factor.$db.update(query)

      console.log("[draft saved]", query, data, revisions)

      return response
    }

    async savePost(post) {
      const data = Object.assign({}, post)
      const { id } = data
      const query = {
        collection: "public",
        data,
        id,
        merge: false
      }

      const response = await Factor.$db.update(query)

      Factor.$events.$emit("purge-url-cache", post.url)

      // Bust cache for url
      if (!post.url.includes("localhost")) {
        Factor.$http.request({ url: post.url, method: "PURGE" })
      }

      return response
    }

    async trashPost({ id }) {
      const query = { table: "posts", id, data: { status: -1 } }

      return await Factor.$db.query(query)
    }

    excerpt(content, { length = 30 } = {}) {
      if (!content) {
        return ""
      }
      let splitContent = Factor.$markdown
        .strip(content)
        .replace(/\n|\r/g, " ")
        .split(" ")

      let excerpt

      if (splitContent.length > length) {
        splitContent = splitContent.slice(0, length)
        excerpt = splitContent.join(" ") + "..."
      } else {
        excerpt = splitContent.join(" ")
      }

      return excerpt
    }

    userCanEditPost({ uid, post }) {
      const user = Factor.$user.request(uid)

      if ((user.privs && user.privs.accessLevel > 300) || post.authors.includes(uid)) {
        return true
      } else {
        return false
      }
    }
  }()
}

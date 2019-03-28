export default Factor => {
  return new class {
    constructor() {
      this.filters()

      this.initialized = false
    }

    filters() {
      Factor.$filters.add("dashboard-routes", _ => {
        _.push({
          path: "posts",
          component: () => import("./vd-posts-dashboard")
        })

        _.push({
          path: "posts/edit",
          component: () => import("./vd-posts-edit"),
          meta: { activePath: "/admin/posts" }
        })

        _.push({
          path: "posts/add-new",
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
        _.post = this.addPostToComponents()

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

          Factor.$store.commit("posts/setItem", {
            item: "post",
            value: post
          })

          if (Factor.$ssrContext) {
            Factor.$ssrContext.metatags = this.getMetatags({ post, parts })
          }

          return
        }

        _.push(_promise())

        return _
      }

      Factor.$filters.add("site-prefetch-promises", setPost)
      Factor.$filters.add("site-route-promises", setPost)

      Factor.$filters.add("dashboard-menu", _ => {
        this.getPostTypes().forEach(({ type, base, name, icon = "" }) => {
          _.push({
            group: "posts",
            path: "posts",
            name: name || Factor.$utils.toLabel(type),
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
      return this.$store.getters["posts/getItem"]("post") || {}
    }

    init(cb) {
      if (this.initialized) {
        cb()
      } else {
        hook.$on("postInit", () => {
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

    async getTable({ type, status = ["published"], tag, limit = 20, storeKey = "table" }) {
      const constraints = []

      if (type) {
        constraints.push(`type:${type}`)
      }

      if (tag) {
        constraints.push(`tags:${tag}`)
      }

      const statusFilters = status
        .map(_ => {
          return `status:${_}`
        })
        .join(" OR ")

      constraints.push(statusFilters)

      const filters = constraints.map(_ => `(${_})`).join(" AND ")

      const query = { table: "posts", limit, filters }

      const posts = await Factor.$db.search(query)

      const parsed = await this.parsePosts(posts)

      Factor.$store.commit("posts/setItem", {
        item: storeKey,
        value: parsed
      })

      return parsed
    }

    async parsePosts(posts) {
      if (!posts || posts.length == 0) {
        return []
      }

      const _promises = posts.reverse().map(async p => {
        let authorData = []
        if (p.authors && Array.isArray(p.authors) && p.authors.length > 0) {
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
      this.pageTemplates = Factor.$filters.apply("page-templates", [])

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
      return Factor.$filters.apply("post-types", [{ type: "page", base: "" }]).map(_ => {
        return {
          type: _.type,
          base: typeof _.base == "undefined" ? _.type : _.base,
          name: Factor.$utils.toLabel(_.type)
        }
      })
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
      return await Factor.$db.query({
        table: "posts",
        id
      })
    }

    async getPostByPermalink(permalink) {
      const results = await Factor.$db.query({
        table: "posts",
        where: [
          {
            field: `permalink`,
            comp: "==",
            value: permalink
          }
        ],
        query: {
          table: "flames"
        }
      })

      if (!results || results.length == 0) {
        return
      }

      const post = results[0]

      const { authors } = post

      let _promises = []
      if (authors && Array.isArray(authors) && authors.length > 0) {
        _promises = authors.map(async uid => {
          return await Factor.$user.request(uid)
        })
      }

      const flameQuery = {
        table: "posts",
        id: post.id,
        query: {
          table: "meta",
          id: "flames"
        }
      }

      const [flames, authorData] = await Promise.all([
        Factor.$db.query(flameQuery),
        Promise.all(_promises)
      ])

      post.authorData = authorData
      post.flames = Object.keys(flames).length

      return post
    }

    // Limit saved revisions to 20 and one per hour after first hour
    _cleanRevisions(revisions) {
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

    async saveDraft(draft) {
      draft.revisions = this._cleanRevisions(draft.revisions)
      const query = {
        table: "posts",
        data: draft,
        id: draft.id,
        merge: true
      }
      const response = await Factor.$db.save(query)

      console.log("[draft saved]", query, draft.revisions)

      return response
    }

    async publishPost(post) {
      const data = Object.assign({}, post)
      const query = {
        table: "posts",
        data,
        id: post.id,
        merge: false
      }

      const response = await Factor.$db.publish(query)

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
        .replace(/\n|\r/g, "")
        .split(" ")

      let excerpt

      if (splitContent.length > length) {
        splitContent = splitContent.slice(0, length)
        excerpt = splitContent.join(" ") + "..."
      }

      return excerpt
    }
  }()
}

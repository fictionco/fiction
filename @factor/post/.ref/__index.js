import Factor from "@factor/core"
import { getPopulatedFields } from "./util"
import { toLabel, excerpt, slugify } from "@factor/tools/utils"

export default () => {
  return new (class {
    constructor() {
      this.filters()

      this.objectHash = require("object-hash")
      this.initialized = false
    }

    async request(method, params) {
      return await Factor.$endpoint.request({ id: "posts", method, params })
    }

    async save({ post, postType }) {
      this.setCache(postType)
      return await this.request("save", { data: post, postType })
    }

    async saveMany({ _ids, data, postType }) {
      this.setCache(postType)
      return await this.request("updateManyById", {
        data,
        _ids
      })
    }

    async deleteMany({ _ids, postType }) {
      this.setCache(postType)
      return await this.request("deleteManyById", { _ids })
    }

    setCache(postType) {
      Factor.$store.add(`${postType}Cache`, Factor.$time.stamp())
    }

    cacheKey(postType) {
      return Factor.$store.val(`${postType}Cache`) || ""
    }

    filters() {
      Factor.$filters.callback("site-prefetch", _ => this.prefetchPost(_))
      Factor.$filters.callback("client-route-before", _ =>
        this.prefetchPost({ clientOnly: true, ..._ })
      )

      Factor.$filters.add("components", _ => {
        _["factor-post-edit"] = () => import("./el/edit-link")
        return _
      })

      Factor.$filters.add("dashboard-routes", _ => {
        _.push({
          path: "posts",
          component: () => import("./dashboard-list")
        })

        _.push({
          path: "posts/edit",
          component: () => import("./dashboard-edit")
          // meta: { activePath: "/admin/posts" }
        })

        _.push({
          path: "posts/:postType/edit",
          component: () => import("./dashboard-edit")
          //meta: { activePath: "/admin/posts" }
        })

        _.push({
          path: "posts/:postType/add-new",
          component: () => import("./dashboard-edit"),
          meta: {}
        })

        _.push({
          path: "posts/:postType",
          component: () => import("./dashboard-list"),
          meta: {}
        })

        return _
      })

      Factor.$filters.add("admin-menu", _ => {
        this.getPostTypes()
          .filter(({ showAdmin, accessLevel }) => {
            return showAdmin === false ||
              (accessLevel && !Factor.$user.can({ accessLevel }))
              ? false
              : true
          })
          .forEach(({ postType, namePlural, icon = "", add = "add-new" }) => {
            const subMenu = []

            if (add) {
              subMenu.push({
                path: add,
                name: toLabel(add)
              })
            }

            subMenu.push({
              path: "edit"
            })

            _.push({
              group: postType,
              path: `posts/${postType}`,
              name: namePlural || toLabel(postType),
              icon,
              items: Factor.$filters.apply(`admin-menu-post-${postType}`, subMenu)
            })
          })

        return _
      })
    }

    // setPrefetch() {
    //   Factor.$filters.callback("ssr-prefetch", async () => {
    //     this.prefetch = this.prefetchPost()
    //     return await this.prefetch
    //   })
    // }

    // serverPrefetch() {
    //   return this.prefetch || null
    // }

    async prefetchPost({ to = null, clientOnly = false } = {}) {
      const route = to || Factor.$router.currentRoute

      const request = Factor.$filters.apply("post-params", {
        ...route.params,
        ...route.query,
        status: "published"
      })

      const { permalink, _id } = request

      // Only add to the filter if permalink is set. That way we don't show loader for no reason.
      if ((!permalink && !_id) || permalink == "__webpack_hmr") return {}

      // For prefetching that happens only in the browser
      // If this applied on server it causes a mismatch (store set with full post then set to loading)
      if (clientOnly) {
        Factor.$store.add("post", { loading: true })
      }

      const post = await this.getSinglePost(request)

      Factor.$store.add("post", post)

      if (post) {
        this.postStandardMetatags(post._id)
      }

      return post
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
      return this.$store.val("post") || {}
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

    postStandardMetatags(_id) {
      const post = Factor.$store.val(_id) || {}

      const out = {
        canonical: this.link(_id, { root: true }),
        title: post.titleTag || post.title || "",
        description: post.descriptionTag || excerpt(post.content) || "",
        image:
          post.avatar && Factor.$store.val(post.avatar)
            ? Factor.$store.val(post.avatar).url
            : ""
      }

      Factor.$globals.metatags.push(out)
    }

    async getPostById({ _id, postType = "post", createOnEmpty = false }) {
      const _post = await this.request("single", { _id, postType, createOnEmpty })

      if (_post) {
        Factor.$store.add(_post._id, _post)
      }

      return _post
    }

    async getSinglePost(args) {
      const {
        permalink,
        field = "permalink",
        postType = "post",
        _id,
        token,
        createOnEmpty = false,
        status = "all",
        depth = 50
      } = args

      const params = { postType, createOnEmpty, status }

      if (_id) {
        params._id = _id
        const existing = Factor.$store.val(_id)
        if (existing) {
          Factor.$store.add("post", existing)
          return existing
        }
      } else if (permalink) {
        params.conditions = { [field]: permalink }
      } else if (token) {
        params.token = token
      }

      const post = await this.request("single", params)

      if (post) {
        await this.populatePosts({ posts: [post], depth })
      }

      return post
    }

    // Gets List of Posts
    // The difference with 'index' is that there is no meta information returned
    async getList(args) {
      const { limit = 10, page = 1, postType, sort, depth = 20, conditions = {} } = args

      const skip = (page - 1) * limit

      const posts = await this.request("postList", {
        postType,
        conditions,
        options: { limit, skip, page, sort }
      })

      await this.populatePosts({ posts, depth })

      return posts
    }

    async getPostIndex(args) {
      const { limit = 10, page = 1, postType, sort } = args
      const queryHash = this.objectHash({ ...args, cache: this.cacheKey(postType) })
      const stored = Factor.$store.val(queryHash)

      // Create a mechanism to prevent multiple runs/pops for same data
      if (stored) {
        Factor.$store.add(postType, stored)
        return stored
      }

      const taxonomies = ["tag", "category", "status", "role"]

      const conditions = {}
      taxonomies.forEach(_ => {
        if (args[_]) {
          conditions[_] = args[_]
        }
      })

      if (!args.status) {
        conditions.status = { $ne: "trash" }
      }

      const skip = (page - 1) * limit

      const { posts, meta } = await this.request("postIndex", {
        postType,
        conditions,
        options: { limit, skip, page, sort }
      })

      Factor.$store.add(queryHash, { posts, meta })
      Factor.$store.add(postType, { posts, meta })

      await this.populatePosts({ posts, depth: 20 })

      return { posts, meta }
    }

    async populatePosts({ posts, depth = 10 }) {
      let _ids = []

      posts.forEach(post => {
        Factor.$store.add(post._id, post)

        const populatedFields = getPopulatedFields({
          postType: post.postType,
          depth
        })

        populatedFields.forEach(field => {
          const v = post[field]
          if (v) {
            if (Array.isArray(v)) {
              _ids = [..._ids, ...v]
            } else {
              _ids.push(v)
            }
          }
        })
      })

      const _idsFiltered = _ids.filter((_id, index, self) => {
        return !Factor.$store.val(_id) && self.indexOf(_id) === index ? true : false
      })

      if (_idsFiltered.length > 0) {
        const posts = await this.request("populate", { _ids: _idsFiltered })
        await this.populatePosts({ posts, depth })
      }
    }

    getPostTypes() {
      return Factor.$filters.apply("post-types", []).map(_ => {
        return {
          baseRoute: typeof _.baseRoute == "undefined" ? _.postType : _.baseRoute,
          nameIndex: toLabel(_.postType),
          nameSingle: toLabel(_.postType),
          namePlural: toLabel(_.postType),
          ..._
        }
      })
    }

    postTypeMeta(postType) {
      return this.getPostTypes().find(pt => pt.postType == postType)
    }

    populatedFields({ postType, depth = 10 }) {
      return getPopulatedFields({ postType, depth })
    }

    link(_id, options = {}) {
      const post = Factor.$store.val(_id)

      if (!post) return

      return this.getPermalink({ ...post, ...options })
    }

    getPermalink(args = {}) {
      const { postType, permalink = "", root = false, path = false } = args
      const parts = []

      parts.push(root ? Factor.$setting.get("url") : "")

      if (path) {
        parts.push(path)
        return parts.join("").replace(/\/$/, "") // remove trailing backslash
      } else {
        const postTypeMeta = postType ? this.postTypeMeta(postType) : false

        if (postTypeMeta) {
          const { baseRoute } = postTypeMeta

          // trim slashes
          if (baseRoute) parts.push(baseRoute.replace(/^\/|\/$/g, ""))
        }

        if (!permalink && args.title) {
          parts.push(slugify(args.title))
        } else {
          parts.push(permalink)
        }

        return parts.join("/")
      }
    }

    titleTag(_id) {
      const { titleTag, title } = Factor.$store.val(_id) || {}
      return titleTag || title || ""
    }

    descriptionTag(_id) {
      const { descriptionTag, subTitle, content } = Factor.$store.val(_id) || {}
      return descriptionTag || subTitle || excerpt(content) || ""
    }

    shareImage(_id) {
      const { shareImage, avatar } = Factor.$store.val(_id) || {}
      const imageId = shareImage ? shareImage : avatar
      const { url } = Factor.$store.val(imageId) || {}
      return url ? url : ""
    }

    // Get the count of posts with a given status (or similar)
    // Null values (e.g. status is unset) should be given the value assigned by nullKey
    // Use in table control filtering
    getStatusCount({ meta, field = "status", key, nullKey = false }) {
      if (!meta[field]) {
        return 0
      }

      let count
      const result = meta[field].find(_ => _._id == key)

      count = result ? result.count : 0
      if (nullKey && key == nullKey) {
        const nullsCount = meta[field].find(_ => _._id == null)
        count += nullsCount ? nullsCount.count : 0
      }
      return count
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
    // async saveDraft({ id, revisions }) {
    //   const data = {
    //     revisions: this._cleanRevisions(revisions) // limit amount and frequency
    //   }
    //   const query = {
    //     model: "post",
    //     method: "findByIdAndUpdate",
    //     data,
    //     id
    //   }

    //   const response = await Factor.$db.run(query)

    //   console.log("[draft saved]", query, data, revisions)

    //   return response
    // }

    // Verify a permalink is unique,
    // If not unique, then add number and recursively verify the new one
    async permalinkVerify({ permalink, id, field = "permalink" }) {
      const post = await this.getSinglePost({ permalink, field })

      if (post && post.id != id) {
        Factor.$events.$emit("notify", `${toLabel(field)} "${permalink}" already exists.`)
        let num = 1
        var matches = permalink.match(/\d+$/)
        if (matches) {
          num = parseInt(matches[0]) + 1
        }
        permalink = await this.permalinkVerify({
          permalink: `${permalink.replace(/\d+$/, "")}${num}`,
          id
        })
      }
      return permalink
    }

    // async savePost(post) {
    //   let data = Object.assign({}, post)
    //   const { id } = data
    //   data.permalink = await this.permalinkVerify({ permalink: data.permalink, id })
    //   data = await this.addRevision({ post: data, meta: { published: true } })

    //   const query = {
    //     collection: "public",
    //     data,
    //     id,
    //     type: post.type,
    //     merge: false
    //   }

    //   const response = await Factor.$db.update(query)

    //   Factor.$events.$emit("purge-url-cache", post.url)

    //   // Bust cache for url
    //   // if (!post.url.includes("localhost")) {
    //   //   Factor.$http.request({ url: post.url, method: "PURGE" })
    //   // }

    //   return data
    // }

    async addRevision({ post, meta, save = false }) {
      let { revisions, ...postData } = post

      revisions = revisions || []

      const draft = {
        timestamp: Factor.$time.stamp(),
        editor: Factor.$user._id(),
        post: postData,
        ...meta
      }

      post.revisions = [draft, ...revisions]

      if (save) {
        const save = {
          id: this.id,
          revisions: this.post.revisions
        }
        await this.saveDraft(save)
      }

      return post
    }
  })()
}

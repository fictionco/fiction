module.exports.default = Factor => {
  return new (class {
    constructor() {
      Factor.$filters.callback("endpoints", { id: "posts", handler: this })
    }

    getPostTypeModel(postType) {
      return Factor.$dbServer.model(postType)
    }

    async save({ data, postType = "post" }, { bearer }) {
      const { _id } = data

      let _post
      let PostTypeModel = this.getPostTypeModel(postType)

      if (_id) {
        _post = await PostTypeModel.findById(data._id)
      }

      if (!_id || !_post) {
        _post = new PostTypeModel()
      }

      console.log("SAVE DATA", _post, data, postType)

      Object.assign(_post, data)

      return await _post.save()
    }

    async single(params, meta = {}) {
      const { bearer } = meta

      let {
        _id,
        token,
        postType = "post",
        conditions,
        createOnEmpty = false,
        status = "all"
      } = params

      let _post

      let PostTypeModel = this.getPostTypeModel(postType)

      if (token) {
        const decoded = Factor.$userServer.decodeToken(token)
        _id = decoded._id
      }

      // If ID is available, first look for it.
      if (_id) {
        _post = await PostTypeModel.findById(_id)
      } else if (conditions) {
        _post = await PostTypeModel.findOne(conditions)
      }

      if (_post) {
        // Check publication status. If author or mod, still return the post
        if (
          status == "published" &&
          _post.status != "published" &&
          (!bearer || (!_post.author.includes(bearer._id) && bearer.accessLevel < 100))
        ) {
          return null
        }
      }
      // If ID is unset or if it isn't found, create a new post model/doc
      // This is not saved at this point, leading to a post sometimes not existing although an ID exists
      else if (createOnEmpty) {
        const initial = {}
        if (bearer) {
          initial.author = [bearer._id]
        }
        _post = new PostTypeModel(initial)
      }

      return _post
    }

    async updateManyById({ _ids, postType = "post", data }) {
      return await this.getPostTypeModel(postType).update(
        { _id: { $in: _ids } },
        { $set: data },
        { multi: true }
      )
    }

    async deleteManyById({ _ids, postType = "post" }) {
      return await this.getPostTypeModel(postType).remove({ _id: { $in: _ids } })
    }

    async postList(params, { bearer }) {
      let { postType, conditions = {}, select = null, options } = params

      options = Object.assign(
        {},
        {
          sort: "-createdAt",
          limit: 20,
          skip: 0
        },
        options
      )

      return await Factor.$dbServer.model(postType).find(conditions, select, options)
    }

    async postIndex(params, { bearer }) {
      let { postType, conditions = {}, options } = params

      options = Object.assign(
        {},
        {
          sort: "-createdAt",
          limit: 20,
          skip: 0
        },
        options
      )

      const _p = [
        this.indexMeta({ postType, conditions, options }),
        Factor.$dbServer.model(postType).find(conditions, null, options)
      ]

      const [counts, posts] = await Promise.all(_p)

      return { meta: { ...counts, ...options, conditions }, posts }
    }

    async indexMeta({ postType, conditions, options }) {
      const { sort, limit = 20, skip = 0 } = options || {}
      const ItemModel = Factor.$dbServer.model(postType)

      const aggregate = [
        {
          $facet: {
            tags: [{ $unwind: "$tag" }, { $sortByCount: "$tag" }],
            category: [{ $unwind: "$category" }, { $sortByCount: "$category" }],
            status: [
              {
                $group: {
                  _id: "$status",
                  count: { $sum: 1 }
                }
              }
            ],
            role: [
              {
                $group: {
                  _id: "$role",
                  count: { $sum: 1 }
                }
              }
            ]
          }
        }
      ]

      const _p = [
        ItemModel.aggregate(aggregate),
        ItemModel.find(conditions).count(),
        ItemModel.count()
      ]

      const [aggregations, totalForQuery, total] = await Promise.all(_p)

      const pageCount = !totalForQuery ? 1 : Math.ceil(totalForQuery / limit)
      const pageCurrent = 1 + Math.floor(skip / limit)

      const _out = { ...aggregations[0], total, totalForQuery, pageCount, pageCurrent }

      return _out
    }
  })()
}

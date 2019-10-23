import db from "./db"

import { canUpdatePost } from "./util"
import { getModel } from "./util-server"
import Factor from "@factor/core"

export default () => {
  return new (class {
    constructor() {
      this.db = db()

      Factor.$filters.callback("endpoints", { id: "posts", handler: this })
    }

    async save({ data, postType = "post" }, { bearer }) {
      const { _id } = data

      let post
      let isNew
      let Model = getModel(postType)

      if (_id) post = await Model.findById(data._id)

      if (!_id || !post) {
        isNew = true
        post = new Model()
      }

      Object.assign(post, data)

      return canUpdatePost({ post, bearer, isNew, action: "save" })
        ? await post.save()
        : null
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

      let Model = getModel(postType)

      if (token) {
        const decoded = Factor.$userServer.decodeToken(token)
        _id = decoded._id
      }

      // If ID is available, first look for it.
      if (_id) {
        _post = await Model.findById(_id)
      } else if (conditions) {
        _post = await Model.findOne(conditions)
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
        if (bearer) initial.author = [bearer._id]
        _post = new Model(initial)
      }

      return _post
    }

    authorCondition(bearer) {
      return bearer.accessLevel >= 300 ? {} : { author: bearer._id }
    }

    async updateManyById({ _ids, postType = "post", data }, { bearer }) {
      return await getModel(postType).update(
        { $and: [this.authorCondition(bearer), { _id: { $in: _ids } }] },
        { $set: data },
        { multi: true }
      )
    }

    async deleteManyById({ _ids, postType = "post" }, { bearer }) {
      return await getModel(postType).remove({
        $and: [this.authorCondition(bearer), { _id: { $in: _ids } }]
      })
    }

    async populate({ _ids }) {
      const _in = Array.isArray(_ids) ? _ids : [_ids]
      const result = await getModel("post").find({ _id: { $in: _in } })

      return Array.isArray(_ids) ? result : result[0]
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

      return await getModel(postType).find(conditions, select, options)
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
        getModel(postType).find(conditions, null, options)
      ]

      const [counts, posts] = await Promise.all(_p)

      return { meta: { ...counts, ...options, conditions }, posts }
    }

    async indexMeta({ postType, conditions, options }) {
      const { sort, limit = 20, skip = 0 } = options || {}
      const ItemModel = getModel(postType)

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

module.exports.default = Factor => {
  return new (class {
    constructor() {
      Factor.$filters.callback("endpoints", { id: "posts", handler: this })
    }

    async save({ data, model = "Post" }, { bearer }) {
      let _post
      const PostModel = Factor.$db.model(model)
      if (!data._id) {
        _post = new PostModel(data)
      } else {
        _post = await PostModel.findById(data._id)
        Object.assign(_post, data)
      }

      return await _post.save()
    }

    async single({ _id, model = "Post", populate = "avatar images" }, { bearer }) {
      let _post = await Factor.$db.model(model).findById(_id)

      if (_post) {
        const popped = this.getPostPopulatedFields(_post).join(" ")

        // https://mongoosejs.com/docs/api/document.html#document_Document-populate
        _post = await _post.populate(popped).execPopulate()
      }

      return _post
    }

    // Takes any post document and gets the fields that are meant to be populated
    getPostPopulatedFields(doc) {
      const docSchema = doc.schema
      let p = []

      if (docSchema.populatedFields) {
        p = p.concat(docSchema.populatedFields)
      }

      if (docSchema._baseSchema && docSchema._baseSchema.populatedFields) {
        p = p.concat(docSchema._baseSchema.populatedFields)
      }

      return p
    }

    async list(params, { bearer }) {
      const { model, conditions = {}, options } = params

      const _p = [
        this.indexMeta(params),
        Factor.$db
          .model(model)
          .find(conditions, null, options)
          .populate("avatar")
      ]

      const [counts, posts] = await Promise.all(_p)

      return { meta: { ...counts, ...options, conditions }, posts }
    }

    async indexMeta(params) {
      const { model } = params

      const ItemModel = Factor.$db.model(model)

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

      const _p = [ItemModel.aggregate(aggregate), ItemModel.count()]
      const [aggregations, total] = await Promise.all(_p)

      const _out = { ...aggregations[0], total }

      return _out
    }
  })()
}

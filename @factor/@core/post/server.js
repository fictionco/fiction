module.exports.default = Factor => {
  return new (class {
    constructor() {

      Factor.$filters.callback("endpoints", { id: "posts", handler: this })
    }

    getPostTypeModel(postType) {
      //const modelName = postType.charAt(0).toUpperCase() + postType.slice(1)
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

      Object.assign(_post, data)

      console.log("SERVER SAVE__", _post)
      return await _post.save()

    }

    async single({ _id, postType = "post", conditions }, { bearer }) {
      let _post
      let PostTypeModel = this.getPostTypeModel(postType)

      // If ID is available, first look for it.
      if (_id) {
        _post = await PostTypeModel.findById(_id)
      } else if (conditions) {
        _post = await PostTypeModel.findOne(conditions)
      }



      // If ID is unset or if it isn't found, create a new post model/doc
      // This is not saved at this point, leading to a post sometimes not existing although an ID exists
      if (!_post) {
        const initial = {}
        if (bearer) {
          initial.author = [bearer._id]
        }
        _post = new PostTypeModel(initial)
      }

      if (_post) {
        const popped = this.getPostPopulatedFields(_post)

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

      return p.map(_ => {
        return { path: _, populate: "avatar" }
      })
    }

    async list(params, { bearer }) {
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
        this.indexMeta(params),
        Factor.$dbServer
          .model(postType)
          .find(conditions, null, options)
          .populate([{ path: "avatar" }, { path: "author", populate: "avatar" }])
      ]

      const [counts, posts] = await Promise.all(_p)

      return { meta: { ...counts, ...options, conditions }, posts }
    }

    async indexMeta(params) {
      const { model } = params

      const ItemModel = Factor.$dbServer.model(model)

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

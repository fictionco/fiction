module.exports.default = Factor => {
  return new (class {
    constructor() {
      Factor.$filters.callback("endpoints", { id: "posts", handler: this })
    }

    async save({ data, model = "Post" }, { bearer }) {
      let _post
      const PostModel = Factor.$db.model(model)
      if (data._id) {
        _post = new PostModel(data)
      } else {
        _post = await PostModel.findById(data._id)
        Object.assign(_post, data)
      }

      return await _post.save()
    }

    async list(params, { bearer }) {
      const { model, conditions = {}, options } = params

      await this.indexMeta(params)
      const posts = await Factor.$db
        .model(model)
        .find(conditions, null, options)
        .populate("avatar")

      return posts
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
      const [aggregations, count] = await Promise.all(_p)

      const _out = [...aggregations, count]

      console.log("INFO??", require("util").inspect(_out, { showHidden: false, depth: null }))
      return _out
    }
  })()
}

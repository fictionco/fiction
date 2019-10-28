import { timestamp } from "@factor/tools"
export default class PostRevisions {
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

  async addRevision({ post, meta, save = false }) {
    let { revisions, ...postData } = post

    revisions = revisions || []

    const draft = {
      timestamp: timestamp(),
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

  // Limit saved revisions to 20 and one per hour after first hour
  _cleanRevisions(revisions = []) {
    let counter

    const cleanedRevisions = revisions
      .filter(rev => {
        if (
          counter &&
          rev.timestamp > counter - 3600 &&
          rev.timestamp < timestamp() - 3600
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
}

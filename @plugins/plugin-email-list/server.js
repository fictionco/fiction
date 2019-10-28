import { getModel } from "@factor/post/server"

export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.callback("endpoints", { id: "emailList", handler: this })
    }

    uniqueId(listId) {
      return `_plugin-emailList-${listId}`
    }

    postModel() {
      return getModel("emailList")
    }

    // https://stackoverflow.com/questions/33576223/using-mongoose-mongodb-addtoset-functionality-on-array-of-objects
    async addEmail({ email, listId = "default", tags = [] }) {
      // Allow for external services to hook in
      email = Factor.$filters.apply(`plugin-email-list-add-${listId}`, email)

      const code = Factor.$randomToken()

      // Ensure that the post exists
      // Can't do all this in one query or it prevents detection of dupes / create unique index problems
      const r = await this.postModel().updateOne(
        { uniqueId: this.uniqueId(listId) },
        { title: listId },
        { upsert: true }
      )

      const result = await this.postModel().updateOne(
        { uniqueId: this.uniqueId(listId), "list.email": { $ne: email } },
        { $addToSet: { list: { email, verified: false, code, tags } } }
      )

      // If email already exists, update it with new code
      if (result.nModified == 0) {
        const r2 = await this.postModel().updateOne(
          { uniqueId: this.uniqueId(listId), "list.email": email },
          { $set: { "list.$.code": code } }
        )
      }

      if (Factor.$emailServer.hasEmail) {
        await this.sendConfirmEmail({ email, listId, code })
      }

      Factor.$events.$emit("email-list-new-email-added", { email, listId, tags })

      return true
    }

    async deleteEmails({ emails, listId = "default" }, { bearer }) {
      // query resource: https://stackoverflow.com/a/48933447/1858322
      const result = await this.postModel().updateOne(
        { uniqueId: this.uniqueId(listId) },
        { $pull: { list: { email: { $in: emails } } } }
      )

      return result
    }

    // Positional Operator
    // https://docs.mongodb.com/manual/reference/operator/update/positional/?_ga=1.12567092.1864968360.1429722620#up._S_
    async verifyEmail({ email, list: listId, code }) {
      const result = await this.postModel().updateOne(
        { uniqueId: this.uniqueId(listId), "list.code": code, "list.email": email },
        { $set: { "list.$.verified": true, "list.$.code": null } }
      )

      if (result && result.nModified > 0) {
        await Promise.all([
          this.sendNotifyEmail({ email, listId }),
          this.sendCompleteEmail({ email, listId })
        ])
      }

      return result
    }

    async sendConfirmEmail({ email, listId, code }) {
      const action = `verify-email-list`

      const format = Factor.$emailList.getSetting({
        key: "emails.confirm",
        listId
      })

      if (!format) {
        return await sendCompleteEmail({ email, listId })
      }

      const { subject, text, from, linkText } = format

      const linkUrl = `${Factor.$setting.get(
        "currentUrl"
      )}?_action=${action}&code=${code}&email=${encodeURIComponent(email)}&list=${listId}`

      return await Factor.$emailServer.sendTransactional({
        to: email,
        from,
        subject,
        text,
        linkText,
        linkUrl
      })
    }

    async sendCompleteEmail({ email, listId }) {
      const format = Factor.$emailList.getSetting({
        key: "emails.complete",
        listId
      })

      if (!format) return

      const { subject, text, from } = format

      return await Factor.$emailServer.sendTransactional({
        to: email,
        subject,
        text,
        from
      })
    }

    async sendNotifyEmail({ email, listId }) {
      const format = Factor.$emailList.getSetting({
        key: "emails.notify",
        listId
      })

      if (!format) return

      let { subject, text, to, from } = format

      if (to) {
        await Factor.$emailServer.sendTransactional({
          to,
          subject,
          text: text + `<p><strong>Email:</strong> ${email}</p>`,
          from
        })
      }

      return
    }
  })()
}

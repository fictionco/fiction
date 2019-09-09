export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.callback("endpoints", { id: "emailList", handler: this })
    }

    uniqueId(listId) {
      return `email-list-${listId}`
    }

    // https://stackoverflow.com/questions/33576223/using-mongoose-mongodb-addtoset-functionality-on-array-of-objects
    async addEmail({ email, listId = "default" }) {
      const code = Factor.$randomToken()

      const postModel = Factor.$dbServer.model("post")

      const result = await postModel.updateOne(
        { uniqueId: this.uniqueId(listId) },
        { $addToSet: { list: { email, verified: false, code } } },
        { upsert: true }
      )

      if (Factor.$emailServer.hasEmail) {
        await this.sendConfirmEmail({ email, listId, code })
      }

      return true
    }

    // Positional Operator
    // https://docs.mongodb.com/manual/reference/operator/update/positional/?_ga=1.12567092.1864968360.1429722620#up._S_
    async verifyEmail({ email, list: listId, code }) {
      const result = await Factor.$dbServer
        .model("post")
        .updateOne(
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

      const linkUrl = `${Factor.$config.setting(
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

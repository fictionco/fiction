export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.callback("endpoints", { id: "emailList", handler: this })
    }

    // https://stackoverflow.com/questions/33576223/using-mongoose-mongodb-addtoset-functionality-on-array-of-objects
    async addEmail({ email, listId = "emailList" }) {
      const code = Factor.$randomToken()

      const postModel = Factor.$dbServer.model("post")

      // const exists = await postModel.findOne({ uniqueId: listId }, "_id")
      // if (!exists) {
      //   await postModel.create({ uniqueId: listId })
      // }

      const result = await postModel.updateOne(
        { uniqueId: listId },
        { $addToSet: { list: { email, verified: false, code } } },
        { upsert: true }
      )

      console.log("result", result)

      await this.sendConfirmEmail({ email, listId, code })

      return true
    }

    // Positional Operator
    // https://docs.mongodb.com/manual/reference/operator/update/positional/?_ga=1.12567092.1864968360.1429722620#up._S_
    async verifyEmail({ email, list, code }) {
      const result = await Factor.$dbServer
        .model("post")
        .updateOne(
          { uniqueId: list, "list.code": code, "list.email": email },
          { $set: { "list.$.verified": true, "list.$.code": null } }
        )

      await Promise.all([
        this.sendNotifyEmail({ email, listId }),
        this.sendVerifiedEmail({ email, listId })
      ])

      return result
    }

    async sendConfirmEmail({ email, listId, code }) {
      const action = `verify-email-list`

      const { subject, text, linkText } = Factor.$emailList.getSetting({
        key: "emails.confirm",
        listId
      })

      const linkUrl = `${Factor.$config.setting(
        "currentUrl"
      )}?_action=${action}&code=${code}&email=${encodeURIComponent(email)}&list=${listId}`

      return await Factor.$emailServer.sendTransactional({
        to: email,
        subject,
        text,
        linkText,
        linkUrl
      })
    }

    async sendVerifiedEmail({ email, listId }) {
      const { subject, text } = Factor.$emailList.getSetting({
        key: "emails.verified",
        listId
      })

      return await Factor.$emailServer.sendTransactional({
        to: email,
        subject,
        text
      })
    }

    async sendNotify({ email, listId }) {
      let { subject, text, to } = Factor.$emailList.getSetting({
        key: "emails.notify",
        listId
      })

      if (to) {
        await Factor.$emailServer.sendTransactional({
          to,
          subject,
          text: text + `<p><strong>Email:</strong> ${email}</p>`
        })
      }

      return
    }
  })()
}

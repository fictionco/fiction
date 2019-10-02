module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.events()
    }

    events() {
      const SLACK_NOTIFY_URL = Factor.$setting.get("SLACK_NOTIFY_URL")

      if (SLACK_NOTIFY_URL) {
        // Track email sign up events
        Factor.$events.$on(
          "email-list-new-email-added",
          ({ email, listId, tags = [] }) => {
            let text = `New email [${email}] added to [${listId}].`

            if (tags.length > 0) {
              text += ` Tags: ${tags.join(", ")}`
            }

            Factor.$http.request({
              method: "post",
              url:
                "https://hooks.slack.com/services/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",
              data: { text }
            })
          }
        )
      }

      Factor.$events.$on("email-list-new-email-requested", ({ email, listId }) => {
        if (typeof fbq != "undefined") {
          fbq("track", "Subscribe")
        }
      })
    }
  })()
}

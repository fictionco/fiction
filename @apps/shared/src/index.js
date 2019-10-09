module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.slack()
      this.facebook()
    }

    slack() {
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
              url: SLACK_NOTIFY_URL,
              data: { text }
            })
          }
        )

        Factor.$filters.add("transactional-email", email => {
          Factor.$http.request({
            method: "post",
            url: SLACK_NOTIFY_URL,
            data: {
              pretext: `Email Sent to "${email.to}" from "${email.from}"`,
              title: email.subject,
              text: email.text
            }
          })
        })
      }
    }

    facebook() {
      Factor.$events.$on("email-list-new-email-requested", ({ email, listId }) => {
        if (typeof fbq != "undefined") {
          fbq("track", "Subscribe")
        }
      })
    }
  })()
}

import Factor from "@factor/core"
import { onEvent, addFilter, setting } from "@factor/tools"
export default () => {
  return new (class {
    constructor() {
      this.slack()

      this.facebook()
    }

    slack() {
      const SLACK_NOTIFY_URL = setting("SLACK_NOTIFY_URL")

      if (SLACK_NOTIFY_URL) {
        this.SLACK_NOTIFY_URL = SLACK_NOTIFY_URL
      }
      if (SLACK_NOTIFY_URL) {
        // Track email sign up events
        onEvent("email-list-new-email-added", ({ email, listId, tags = [] }) => {
          let text = `New email [${email}] added to [${listId}].`

          if (tags.length > 0) {
            text += ` Tags: ${tags.join(", ")}`
          }

          Factor.$http.request({
            method: "post",
            url: this.SLACK_NOTIFY_URL,
            data: { text }
          })
        })

        addFilter("transactional-email", email => {
          Factor.$http.request({
            method: "post",
            url: this.SLACK_NOTIFY_URL,
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
      onEvent("email-list-new-email-requested", ({ email, listId }) => {
        if (typeof fbq != "undefined") {
          fbq("track", "Subscribe")
        }
      })
    }
  })()
}

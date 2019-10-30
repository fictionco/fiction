import axios from "axios"
import { onEvent, addFilter, setting } from "@factor/tools"

slack()

facebook()

function slack() {
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

      axios.request({
        method: "post",
        url: this.SLACK_NOTIFY_URL,
        data: { text }
      })
    })

    addFilter("transactional-email", email => {
      axios.request({
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

function facebook() {
  onEvent("email-list-new-email-requested", () => {
    if (typeof fbq != "undefined") {
      window.fbq("track", "Subscribe")
    }
  })
}

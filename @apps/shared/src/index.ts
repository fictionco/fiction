import axios from "axios"
import { onEvent, addFilter } from "@factor/api"
import { EmailTransactionalConfig } from "@factor/email/util"

const slack = (): void => {
  if (process.env.SLACK_NOTIFY_URL) {
    // Track email sign up events
    onEvent(
      "email-list-new-email-added",
      ({
        email,
        listId,
        tags = []
      }: {
        email: string;
        listId: string;
        tags: string[];
      }) => {
        if (window && window.dataLayer) {
          window.dataLayer.push({ event: "emailListSignupSuccess" })
        }

        let text = `New email [${email}] added to [${listId}].`

        if (tags.length > 0) {
          text += ` Tags: ${tags.join(", ")}`
        }

        axios.request({
          method: "post",
          url: process.env.SLACK_NOTIFY_URL,
          data: { text }
        })
      }
    )

    addFilter({
      key: "notifySlack",
      hook: "transactional-email",
      callback: (email: EmailTransactionalConfig) => {
        axios.request({
          method: "post",
          url: process.env.SLACK_NOTIFY_URL,
          data: {
            pretext: `Email Sent to "${email.to}" from "${email.from}"`,
            title: email.subject,
            text: email.text
          }
        })
      }
    })
  }
}

const facebook = (): void => {
  onEvent("email-list-new-email-requested", () => {
    // Track event in Tag Manager
    if (window && window.dataLayer) {
      window.dataLayer.push({ event: "emailListSignupRequest" })
    }
    if (typeof window.fbq != "undefined") {
      window.fbq("track", "Subscribe")
    }
  })
}

slack()

facebook()

/* eslint-disable @typescript-eslint/camelcase */
import axios from "axios"
import { onEvent, addFilter, log } from "@factor/api"
import { EmailTransactionalConfig } from "@factor/email/util"

const notifySlack = async ({
  pretext,
  title,
  text
}: {
  pretext: string;
  title: string;
  text: string;
}): Promise<void> => {
  await axios.request({
    method: "post",
    url: process.env.SLACK_NOTIFY_URL,
    data: { pretext, title, text }
  })
  return
}

const slack = async (): Promise<void> => {
  if (process.env.SLACK_NOTIFY_URL) {
    // Track email sign up events
    onEvent(
      "email-list-new-email-added",
      async ({
        email,
        listId,
        tags = []
      }: {
        email: string;
        listId: string;
        tags: string[];
      }) => {
        let text = `New email [${email}] added to [${listId}].`

        if (tags.length > 0) {
          text += ` Tags: ${tags.join(", ")}`
        }

        axios.request({
          method: "post",
          url: process.env.SLACK_NOTIFY_URL,
          data: { text }
        })

        const r = await axios.request({
          method: "get",
          url: encodeURI(
            `https://slack.com/api/users.admin.invite?token=${process.env.SLACK_LEGACY_API_TOKEN}&email=${email}&channels=CG24NJBU1&resend=true`
          )
        })

        // Make sure to remove circular refs
        // https://github.com/WebReflection/flatted#flatted
        const { stringify } = require("flatted/cjs")
        notifySlack({
          pretext: `Slack Invite Sent to ${email}`,
          title: "Slack Invite Sent",
          text: stringify(r)
        })
      }
    )

    addFilter({
      key: "notifySlack",
      hook: "transactional-email",
      callback: (email: EmailTransactionalConfig) => {
        const { subject = "No Subject", text = "No Text", to, from } = email

        notifySlack({
          pretext: `Email Sent to "${to}" from "${from}"`,
          title: subject,
          text
        })
      }
    })
  }
}

const facebook = (): void => {
  onEvent("email-list-new-email-requested", () => {
    if (typeof window.fbq != "undefined") {
      window.fbq("track", "Subscribe")
    }
  })
}

const googleAds = (): void => {
  onEvent("email-list-new-email-confirmed", () => {
    if (window && window.dataLayer) {
      window.dataLayer.push({ event: "emailListSignupSuccess" })
    }
  })
  onEvent("email-list-new-email-requested", () => {
    // Track event in Tag Manager
    if (window && window.dataLayer) {
      window.dataLayer.push({ event: "emailListSignupRequest" })
    }
  })
}

slack()

facebook()

googleAds()

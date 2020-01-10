/* eslint-disable @typescript-eslint/camelcase */
import axios from "axios"
import { onEvent, addFilter, addCallback } from "@factor/api"
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

        const { data } = await axios.request({
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
          text: stringify(data)
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

export const analyticsEvent = ({
  category,
  action,
  label,
  value
}: {
  category: string;
  action: string;
  label?: string;
  value?: number;
}): void => {
  label = label ? label : action

  if (window.ga && window.ga.getAll) {
    const tracker = window.ga.getAll()[0]
    if (tracker) {
      tracker.send("event", category, action, label, value)
    }
  }
}

/**
 * @remarks
 * - Event: ga('send', 'event', [eventCategory], [eventAction], [eventLabel], [eventValue], [fieldsObject]);
 */
const google = (): void => {
  onEvent("email-list-new-email-confirmed", () => {
    if (window && window.dataLayer) {
      window.dataLayer.push({ event: "emailListSignupSuccess" })
      analyticsEvent({ category: "newLead", action: "verifiedEmail", value: 3 })
    }
  })

  onEvent("email-list-new-email-requested", () => {
    // Track event in Tag Manager
    if (window && window.dataLayer) {
      window.dataLayer.push({ event: "emailListSignupRequest" })
      analyticsEvent({ category: "newLead", action: "submittedEmail", value: 1 })
    }
  })
  /**
   * Track auth events in Analytics
   */
  addFilter({
    hook: "authenticated",
    key: "trackEvent",
    callback: (user, params) => {
      if (window.ga && user) {
        if (params.newAccount) {
          analyticsEvent({ category: "newLead", action: "newAccount", value: 5 })
        } else {
          analyticsEvent({ category: "returnUser", action: "loggedIn", value: 1 })
        }
      }
    }
  })

  addCallback({
    key: "trackInstall",
    hook: "route-query-action-track-install",
    callback: ({ method }: { method: string }) => {
      analyticsEvent({ category: "newInstall", action: method, value: 10 })
    }
  })
}

slack()

facebook()

google()

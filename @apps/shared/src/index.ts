/* eslint-disable @typescript-eslint/camelcase */
import axios from "axios"
import { onEvent, addFilter, splitDisplayName } from "@factor/api"
import { EmailTransactionalConfig } from "@factor/email/util"
import {
  FactorUser,
  FactorUserCredential,
  AuthenticationParameters
} from "@factor/user/types"
/**
 * Send a notification to Slack
 */
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

enum ActiveCampaignList {
  DevGroup = 2
}

enum ActiveCampaignStatus {
  Subscribed = 1,
  Unsubscribed = 2
}

/**
 * Manipulate contacts with ActiveCampaign
 * @param contact - contact info
 */
const addOrUpdateActiveCampaignContact = async (contact: {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string | number;
}): Promise<void> => {
  const baseUrl = "https://fiction41560.api-us1.com/api/3"
  const { data } = await axios.request({
    url: `${baseUrl}/contact/sync`,
    method: "post",
    headers: { "Api-Token": process.env.ACTIVE_CAMPAIGN_KEY },
    data: { contact }
  })

  const contactId = data.contact?.id ?? false

  if (contactId) {
    await axios.request({
      url: `${baseUrl}/contactLists`,
      method: "post",
      headers: { "Api-Token": process.env.ACTIVE_CAMPAIGN_KEY },
      data: {
        contactList: {
          list: ActiveCampaignList.DevGroup,
          contact: contactId,
          status: ActiveCampaignStatus.Subscribed
        }
      }
    })
  }

  return
}

const slack = async (): Promise<void> => {
  if (process.env.SLACK_NOTIFY_URL) {
    // Track email sign up events
    onEvent("new-account-created", async ({ email, displayName }: FactorUser) => {
      const { firstName, lastName } = splitDisplayName(displayName)

      // Add new contact to email marketing
      addOrUpdateActiveCampaignContact({ email, firstName, lastName })

      const text = `New account created ${displayName} [${email}]`

      axios.request({
        method: "post",
        url: process.env.SLACK_NOTIFY_URL,
        data: { text }
      })
    })

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

const facebookTrack = (eventName: string): void => {
  if (typeof window.fbq != "undefined") {
    window.fbq("track", eventName)
  }
}

const facebook = (): void => {
  onEvent("email-list-new-email-requested", () => {
    facebookTrack("Subscribe")
  })
}

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

/**
 * Trigger an Event with Google Analytics
 * @param _arguments - arguments around analytics
 */
export const analyticsEvent = (_arguments: AnalyticsEvent): void => {
  const { category, action, value } = _arguments

  let tries = 0

  let { label } = _arguments
  label = label ? label : action

  facebookTrack(category)

  if (window.ga && window.ga.getAll) {
    const tracker = window.ga.getAll()[0]
    if (tracker) {
      tracker.send("event", category, action, label, value)
    }
  } else if (tries < 3) {
    tries++
    setTimeout(() => analyticsEvent(_arguments), 1000)
  }
}

/**
 * Track google events
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
  onEvent(
    "userAuthenticated",
    ({
      user,
      params
    }: {
      user: FactorUserCredential;
      params: AuthenticationParameters;
    }) => {
      if (user) {
        if (params.newAccount) {
          analyticsEvent({
            category: "newAccount",
            action: "newAccount",
            label: user.email,
            value: 5
          })
        } else {
          analyticsEvent({
            category: "returnUser",
            action: "loggedIn",
            label: user.email,
            value: 1
          })
        }
      }
    }
  )
}

slack()

facebook()

google()

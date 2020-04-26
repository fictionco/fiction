---
title: Transactional Email
description: Sending transactional email with Factor
---

# Sending Transactional Email

Learn how to set up and send transactional emails.

## Overview

Transactional email is useful or required for many important tasks. Some examples: 

- Password resets 
- Email verification
- Email notifications (replies, comments)

For this reason, Factor supports sending SMTP transactional emails natively and offers a basic format for sending them. 


## Setting Up

### SMTP

SMTP is the main way of sending email messages from your app. It is a protocol used between different email hosts and it's truly universal. 

Almost every email delivery provider supports SMTP based sending, even if they mainly push their API based sending. APIs might have more features but means vendor lock-in while in case of SMTP you only need to change the configuration to replace one provider with another.

SMTP has many advantages over other approaches. Read [this](https://nodemailer.com/usage/why-smtp/) for more info.

If you'd like a recommendation, we use Mailgun and have written an integration guide [here](./mailgun).

### Config

For your app to send emails, you'll need to setup SMTP. Until you do so, emails will be logged to the terminal but not sent. 

Just add the following to `.env` to get this setup: 

```bash 
SMTP_USERNAME="---YOUR_USERNAME---"
SMTP_PASSWORD="---YOUR_USERNAME---"
SMTP_HOST="host.example.com"
# SMTP_PORT optional
```

Once you've done this, your app should be ready to send emails. 

## Sending Email

To send transactional emails, Factor offers a `sendEmail` function plus some additional helpers.  Note that emails must be sent from the server and not the client, so often you'll need to do the sending from an [endpoint method](./endpoints-and-middleware). 

In addition to sending the email, `sendEmail` formats an HTML email based on the text and links you're sending. This can be changed, as discussed below.

```js

import {sendEmail, sendEmailToId} from "@factor/api/server"


const myEndpointMethod = async (params, meta) => {

  const emailConfig = {
    subject: "Email Subject",
    to: ["example@example.com"], 
    from: "you@your-app.com", // set this optionally, it defaults to app email
    title: "Title text in the email",
    text: "Text in the email",
    linkText: "Example Action",
    linkUrl: "https://example.com/example-action",
    textFooter: "Put footer text here, like unsubscribe info",
  }

  await sendEmail(emailConfig)

  // Send email to address associated with user _id
  await sendEmailToId(_id, emailConfig)

}
```

## Customizing 

If you'd like to adjust the default output of these emails, that's possible with the `transactional-email` filter. 

```js
import {addFilter} from "@factor/api"

addFilter({
  key: "changeEmail", 
  hook: "transactional-email", 
  callback: emailConfig => {
    // change things
    return emailConfig
  }
})

```

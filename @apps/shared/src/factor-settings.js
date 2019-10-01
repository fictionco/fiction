module.exports.default = Factor => {
  return {
    google_tag_manager: {
      gtm_id: "GTM-THQBLTN"
    },
    bugsnag: {
      client_api_key: "be2b4a0c651443122cb08f2b5e6afb55"
    },
    emailList: {
      alphaProgram: {
        emails: {
          confirm: {
            successMessage:
              "Your email is confirmed. Please your email for next steps (no email? check spam).",
            subject: "Factor Alpha Program: Email confirmation",
            text: `We're glad you've requested access to the Alpha program. Just one more step, please confirm your email.`
          },
          complete: {
            subject: "Success! Next steps...",
            text: `<p>Glad you joined up!</p><p>Stay tuned, we'll be in touch in a few days about your invite to the Factor developer program. In the meantime, hit me up at this email if you have any questions.</p>`,
            from: "Andrew Powers <andrew@fiction.com>"
          },
          notify: {
            subject: "New Confirmed Email",
            text: "A new email was added to a list.",
            to: "Andrew Powers <andrew@fiction.com>"
          }
        },
        form: {
          buttonText: "Request Invite &rarr;"
        }
      }
    },

    contactForm: {
      email: "andrew@fiction.com",
      confirm: {
        title: "Got your message.",
        subTitle: "We'll take a look and be in touch as soon as possible."
      }
    }
  }
}

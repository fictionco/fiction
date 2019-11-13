export default {
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
            "Your email is confirmed.",
          subject: "Factor Beta: Email confirmation",
          text: `Just one more step, please confirm your email.`
        },
        complete: {
          subject: "Success!",
          text: `<p>Great work.</p>
            <p>You've successfully signed up. we'll be in touch soon.</p>`,
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

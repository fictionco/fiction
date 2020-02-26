export default {
  serverAnalytics: {
    trackingId: "UA-109072363-1"
  },
  googleTagManager: {
    googleTagManagerId: "GTM-THQBLTN"
    // developmentMode: true
  },
  bugsnag: {
    clientApiKey: "be2b4a0c651443122cb08f2b5e6afb55"
  },
  emailList: {
    alphaProgram: {
      emails: {
        confirm: {
          successMessage: "Your email is confirmed.",
          subject: "One More Step: Email Confirmation",
          text: `Just one more step, please confirm your email.`
        },
        complete: {
          subject: "Success!",
          text: `<p>Great work.</p>
            <p>You've successfully applied for Factor developer group and you will be hearing more from us soon.</p>
            <p>You will be receiving additional invites in separate emails; if you have any questions or suggestions please email: team@fiction.com.</p>
            <p><b>Looking forward to building something with you!</b></p>`
        },
        notify: {
          subject: "New Confirmed Email",
          text: "A new email was added to a list.",
          to: "Andrew Powers <andrew@fiction.com>"
        }
      },
      form: {
        buttonText: "Join Dev Group &rarr;"
      }
    }
  },

  contactForm: {
    email: "factor@fiction.com",
    confirm: {
      title: "Got your message.",
      subTitle: "We'll be in touch as soon as possible."
    }
  }
}

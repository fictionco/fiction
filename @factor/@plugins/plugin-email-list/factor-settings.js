export default Factor => {
  return {
    emailList: {
      default: {
        emails: {
          confirm: {
            successMessage: "Email confirmed!",
            subject: "Please confirm your email",
            text: "We've received your request. Please confirm your email.",
            linkText: "Confirm Email"
          },
          complete: {
            subject: "Your email has been confirmed",
            text: "Thanks! You'll be hearing from us soon."
          },
          notify: {
            subject: "New Confirmed Email",
            text: "A new email was added to a list."
          }
        },

        form: {
          component: () => import("./email-list-form.vue"),
          buttonText: "Request Invite &rarr;",
          placeholder: "Email Address"
        },
        success: {
          modal: () => import("./modal-confirm.vue"),
          title: "Success",
          text: "Please check your email to confirm your email address."
        }
      }
    }
  }
}

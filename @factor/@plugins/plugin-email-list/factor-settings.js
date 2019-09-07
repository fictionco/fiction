export default Factor => {
  return {
    emailList: {
      customList: {},
      emails: {
        confirm: {
          subject: "Please confirm your email",
          text: "We've received your request. Please confirm your email.",
          linkText: "Confirm Email"
        },
        completed: {
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
        text: "We have your email and you'll be hearing from us soon."
      }
    }
  }
}

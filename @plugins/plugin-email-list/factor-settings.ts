export default {
  emailList: {
    default: {
      emails: {
        confirm: {
          successMessage: "Email confirmed!",
          subject: "Please confirm your email",
          text: "We've received your request. Please confirm your email.",
          linkText: "Confirm Email",
        },
        complete: {
          subject: "Your email has been confirmed",
          text: "Thanks! You'll be hearing from us soon.",
        },
        notify: {
          subject: "New Confirmed Email",
          text: "A new email was added to a list.",
        },
      },

      form: {
        component: (): Promise<any> => import("./email-list-form.vue"),
        buttonText: "Request Invite &rarr;",
        placeholder: "Your Email",
      },
      success: {
        modal: (): Promise<any> => import("./modal-confirm.vue"),
        title: "Excellent work!",
        text:
          "Please check your email to confirm your email address. Now, would you like to create an account?",
        link: (email: string): { path?: string; close?: boolean; text?: string } => {
          return {
            path: `/signin?email=${email}&newAccount=1`,
            text: "Create Account &rarr;",
            close: false,
          }
        },
      },
      validation: {
        error: "Whoops.. There was an issue adding your email.",
        empty: `Please enter an email address.`,
        notEmail: `Please enter a valid email address`,
      },
    },
  },
}

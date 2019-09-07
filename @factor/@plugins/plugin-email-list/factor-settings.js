export default Factor => {
  return {
    emailList: {
      form: {
        component: () => import("./email-list-form.vue"),
        buttonText: "Request Invite &rarr;",
        placeholder: "Email Address"
      },
      success: {
        modal: () => import("./modal-confirm.vue"),
        title: "Success!",
        text: "You're on the list and will be hearing from us soon."
      }

      // form: () => import("./email-list-form.vue"),
      // buttonText: "Request Invite &rarr;",
      // placeholder: "Email Address",
      // successTitle: "Success!",
      // successText: "You're on the list and will be hearing from us soon."
    }
  }
}

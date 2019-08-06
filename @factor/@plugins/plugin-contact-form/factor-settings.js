module.exports.default = Factor => {
  return {
    contactForm: {
      form: () => import("./contact-form"),
      submitText: "Contact Us",
      inputFormat: "horizontal",
      confirm: {
        title: "Got it!",
        subTitle: "We’ll get back to you as soon as possible."
      },
      layout: [
        {
          label: "Your Name",
          _id: "name",
          inputType: "text",
          required: true
        },
        {
          label: "Your Email",
          _id: "email",
          inputType: "email",
          required: true
        },
        {
          label: "Phone",
          _id: "phone",
          inputType: "phone"
        },
        {
          label: "Website",
          _id: "website",
          inputType: "text"
        },
        {
          label: "Location",
          _id: "location",
          inputType: "text"
        },

        {
          label: "Message",
          _id: "message",
          inputType: "textarea"
        }
      ]
    }
  }
}

module.exports.default = Factor => {
  return {
    contactForm: {
      email: Factor.$config.setting("app.email"),
      form: () => import("./contact-form"),
      submit: {
        btn: "primary",
        size: "large",
        text: "Contact Us"
      },
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
          placeholder: "Enter your name",
          required: true
        },
        {
          label: "Your Email",
          _id: "email",
          inputType: "email",
          placeholder: "Enter your email address",
          required: true
        },
        {
          label: "Phone",
          _id: "phone",
          inputType: "phone",
          placeholder: "(xxx) xxx-xxxx",
        },
        {
          label: "Website",
          _id: "website",
          inputType: "text",
          placeholder: "http://www.example.com",
        },
        {
          label: "Location",
          _id: "location",
          inputType: "text",
          placeholder: "Enter your location",
        },

        {
          label: "Message",
          _id: "message",
          inputType: "textarea",
          placeholder: "Enter your message",
        }
      ]
    }
  }
}

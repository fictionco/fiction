import { Component } from "vue"
import { setting } from "@factor/api"
export default {
  contactForm: {
    email: setting("app.email"),
    form: (): Promise<Component> => import("./contact-form.vue"),
    adminEmail: {
      disable: false,
      subject: (form: Record<string, any>): string => {
        return `Contact form submitted from ${form.name}`
      }
    },
    submit: {
      btn: "app-btn factor-btn primary",
      size: "",
      text: "Contact Us"
    },
    inputFormat: "horizontal",
    confirm: {
      title: "Got it!",
      subTitle: "We’ll get back t o you as soon as possible."
    },
    layout: [
      {
        label: "Your Name",
        labelClasses: "",
        _id: "name",
        inputType: "text",
        inputClasses: "",
        placeholder: "Enter your name",
        required: true
      },
      {
        label: "Your Email",
        labelClasses: "",
        _id: "email",
        inputType: "email",
        inputClasses: "",
        placeholder: "Enter your email address",
        required: true
      },
      {
        label: "Phone",
        labelClasses: "",
        _id: "phone",
        inputType: "phone",
        inputClasses: "",
        placeholder: "(xxx) xxx-xxxx"
      },
      {
        label: "Website",
        labelClasses: "",
        _id: "website",
        inputType: "text",
        inputClasses: "",
        placeholder: "http://www.example.com"
      },
      {
        label: "Location",
        labelClasses: "",
        _id: "location",
        inputType: "text",
        inputClasses: "",
        placeholder: "Enter your location"
      },

      {
        label: "Message",
        labelClasses: "",
        _id: "message",
        inputType: "textarea",
        inputClasses: "",
        placeholder: "Enter your message"
      }
    ]
  }
}

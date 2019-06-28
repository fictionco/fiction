module.exports = Factor => {
  return {
    site: {
      logo: () => import("./el/logo-bulma"),
      nav: [
        {
          path: "/",
          name: "Home"
        },
        {
          path: "/elements",
          name: "Elements"
        }
      ],
      nav_cta: {
        path: "https://factor.dev/guide/themes",
        text: "Get Started"
      },
      cta: {
        headline: "Made with Factor",
        subheadline: "Interested in using the factor framework with bulma? We should get started. I’ll setup bulma.",
        path: "https://factor.dev/themes",
        text: "Let's do this"
      }
    },
    footer: {
      social: [
        {
          path: "https://facebook.com",
          icon: "facebook"
        },
        {
          path: "https://twitter.com/",
          icon: "twitter"
        },
        {
          path: "https://instagram.com/",
          icon: "instagram"
        },
        {
          path: "https://linkedin.com/",
          icon: "linkedin"
        },
        {
          path: "https://pinterest.com/",
          icon: "pinterest"
        }
      ],
      logo: () => import("./el/logo-fiction"),
      legal: "&copy; Factor by Fiction.com Inc.",
      terms: [
        {
          path: "https://www.fiction.com/terms-of-service",
          text: "Terms of Service"
        },
        {
          path: "https://www.fiction.com/privacy-policy",
          text: "Privacy Policy"
        }
      ]
    },
    home: {
      meta: {
        title: "Bulma Theme - Factor.js",
        description: "A simple theme for easy implementation of the Bulma CSS framework in Factor.js."
      },

      headline: "Theme Bulma",
      subheadline:
        "Based on the open source CSS framework that uses flexbox and is used by more than 150,000 developers. Theme Bulma makes using the CSS framework in Factor a breeze.",
      actions: [
        {
          class: "button is-medium is-rounded is-primary",
          path: "https://factor.dev/themes",
          text: "Get Started"
        },
        {
          class: "button is-medium is-rounded is-light",
          path: "/elements",
          text: "View Elements"
        }
      ],
      boxesHeadline: "Code Better and Ship Faster.",
      boxes: [
        {
          imageURL: "5-minute.svg",
          title: "5 Minute Setup",
          description:
            "A Factor site can be installed and up and running in a matter of minutes, with only basic coding knowledge."
        },
        {
          imageURL: "mobile.svg",
          title: "Mobile-first",
          description: "Every element is mobile-first and optimizes for vertical reading. Built with five breakpoints."
        },
        {
          imageURL: "serverless.svg",
          title: "Serverless SSR",
          description: "editthis"
        },
        {
          imageURL: "js.svg",
          title: "100% Javascript",
          description:
            "Factor provides a robust basis for the development of any JS application. Modular, minimal, and extensible."
        }
      ]
    }
  }
}

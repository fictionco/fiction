export default Factor => {
  return {
    headTags: {
      font: `<link href="https://fonts.googleapis.com/css?family=Work+Sans:400,600,700" rel="stylesheet" />`
    },
    site: {
      logo: () => import("./el/logo-ultra"),
      logoTitle: "Ultra Theme",
      nav: [
        {
          path: "/",
          name: "Home"
        },
        {
          path: "/#about",
          name: "About"
        },
        {
          path: "/#services",
          name: "Services"
        },
        {
          path: "/#portfolio",
          name: "Portfolio"
        },
        {
          path: "/#news",
          name: "News"
        },
        {
          path: "/#contact",
          name: "Contact"
        }
      ],
      copyright: "&copy; Copyright 2019."
    },
    home: {
      pretitle: "Welcome To Ultra",
      title:
        "A modern one page theme for personal or portfolio exposure with unique effects and features.",
      actions: [
        {
          btn: "primary",
          path: "#contact",
          text: "Start a Project",
          icon: "right-arrow"
        },
        {
          btn: "primary-ol",
          path: "/#about",
          text: "More About Ultra",
          icon: "right-arrow"
        }
      ],
      meta: {
        title: "Ultra Theme - Built with Factor.js",
        description: "A simple portfolio theme for Factor.js framework."
      }
    },

    about: {
      pretitle: "About Me",
      title: "I am Ultra",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
      picture: require("./img/about.jpg"),
      counter: [
        {
          text: "Awards Received",
          number: "56"
        },
        {
          text: "Projects",
          number: "127"
        },
        {
          text: "Cups of Coffee",
          number: "876"
        },
        {
          text: "Happy Clients",
          number: "96"
        }
      ]
    },
    services: {
      pretitle: "What I Do",
      title: "Everything you need to launch and grow your business",
      items: [
        {
          title: "Illustration",
          text:
            "Nemo cupiditate ab quibusdam quaer impedit magni. Earum suscipit ipsum laudantium cupiditate.",
          icon: "illustration"
        },
        {
          title: "Branding",
          text:
            "Nemo cupiditate ab quibusdam quaer impedit magni. Earum suscipit ipsum laudantium cupiditate.",
          icon: "branding"
        },
        {
          title: "Marketing",
          text:
            "Nemo cupiditate ab quibusdam quaer impedit magni. Earum suscipit ipsum laudantium cupiditate.",
          icon: "marketing"
        },
        {
          title: "Web Development",
          text:
            "Nemo cupiditate ab quibusdam quaer impedit magni. Earum suscipit ipsum laudantium cupiditate.",
          icon: "webdev"
        }
      ]
    },
    portfolio: {
      pretitle: "Portfolio",
      title: "Check out some of the latest creative work.",
      indexRoute: "/",
      postRoute: "/portfolio",
      limit: 8,
      returnLinkText: "All Projects",
      components: {
        portfolioWrap: () => import("./portfolio/portfolio-wrap.vue"),
        portfolioIndex: () => import("./portfolio/portfolio-index.vue"),
        portfolioSingle: () => import("./portfolio/portfolio-single.vue"),
        portfolioEntry: () => import("./portfolio/widget-entry.vue"),
        headers: () => import("./portfolio/widget-headers.vue"),
        featuredImage: () => import("./portfolio/widget-featured-image.vue"),
        tags: () => import("./portfolio/widget-tags.vue"),
        returnLink: () => import("./portfolio/widget-return-link.vue"),
        pagination: () => import("./portfolio/widget-pagination.vue")
      },
      layout: {
        index: ["featuredImage"],
        single: ["returnLink", "headers", "featuredImage", "tags", "portfolioEntry"]
      },
      clientsTitle: "Previous Clients",
      clients: [
        {
          picture: require("./img/twitter.svg"),
          alt: "Twitter"
        },
        {
          picture: require("./img/dribbble.svg"),
          alt: "Dribbble"
        },
        {
          picture: require("./img/behance.svg"),
          alt: "Behance"
        },
        {
          picture: require("./img/carbon-tech-pro.svg"),
          alt: "Carbon Tech Pro"
        },
        {
          picture: require("./img/amazon.svg"),
          alt: "Amazon"
        },
        {
          picture: require("./img/wearable-world.svg"),
          alt: "Wearable World"
        }
      ],
      cta: {
        headline: "headline",
        path: "path",
        text: "text do it"
      }
    },
    blog: {
      indexRoute: "/#news",
      postRoute: "/news",
      limit: 4,
      returnLinkText: "All News",
      components: {
        blogSingle: () => import("./blog/blog-single.vue"),
        headers: () => import("./blog/widget-headers.vue"),
        featuredImage: () => import("./blog/widget-featured-image.vue"),
        tags: () => import("./blog/widget-tags.vue"),
        date: () => import("./blog/widget-date.vue"),
        returnLink: () => import("./blog/widget-return-link.vue"),
        excerpt: () => import("./blog/widget-excerpt.vue"),
        pagination: () => import("./blog/widget-pagination.vue")
      },
      layout: {
        index: ["date", "headers", "excerpt"],
        single: ["returnLink", "headers", "featuredImage", "tags", "entry", "authorBio"],
        meta: ["authorDate"]
      }
    },
    news: {
      pretitle: "News",
      title: "Latest News"
      // content: [
      //   {
      //     date: "July 6, 2020",
      //     title: "User Onboarding Done Right: Using The Power of Story.",
      //     content:
      //       "User onboarding is perhaps the most important piece of the entire customer conversion process.",
      //     action: {
      //       btn: "default",
      //       path: "/post-url-goes-here",
      //       text: "Read More..."
      //     }
      //   }
      // ]
    },
    contactForm: {
      email: "contact@fiction.com",
      submit: {
        btn: "secondary",
        text: "Submit"
      },
      inputFormat: "vertical",
      confirm: {
        title: "Got your message.",
        subTitle: "We’ll get back to you as soon as possible at the email you provided."
      },
      layout: [
        {
          placeholder: "Your Name",
          _id: "name",
          inputType: "text",
          required: true
        },
        {
          placeholder: "Your Email",
          _id: "email",
          inputType: "email",
          required: true
        },
        {
          _id: "message",
          inputType: "textarea",
          required: true,
          placeholder: "Your Message"
        }
      ]
    },
    contact: {
      pretitle: "Contact",
      title: "Reach out for a new project or just say hello",
      form: {
        title: "Send a message",
        placeholders: {
          name: "Your Name",
          email: "Your Email",
          text: "Your Message"
        },
        buttonText: "Submit",
        confirmation: {
          title: "Got it!",
          content: "We’ll get back to you as soon as possible at the email you provided."
        }
      },
      info: {
        title: "Contact Info",
        items: [
          {
            title: "Address",
            text: "123 Main St. Mountain View, Ca 94043"
          },
          {
            title: "Email me",
            text: "contact@fiction.com"
          },
          {
            title: "Call",
            text: "(+1)619-777-7777"
          }
        ]
      }
    }
  }
}

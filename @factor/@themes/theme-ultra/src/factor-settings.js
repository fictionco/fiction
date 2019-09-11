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
          path: "#homeContainerID",
          name: "Home",
          target: "homeContainerID"
        },
        {
          path: "#aboutContainerID",
          name: "About",
          target: "aboutContainerID"
        },
        {
          path: "#servicesContainerID",
          name: "Services",
          target: "servicesContainerID"
        },
        {
          path: "#portfolioContainerID",
          name: "Portfolio",
          target: "portfolioContainerID"
        },
        {
          path: "#newsContainerID",
          name: "News",
          target: "newsContainerID"
        },
        {
          path: "#contactPageContainerID",
          name: "Contact",
          target: "contactPageContainerID"
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
          path: "#contactPageContainerID",
          text: "Start a Project",
          icon: "right-arrow"
        },
        {
          btn: "primary-ol",
          path: "/#aboutContainerID",
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
      pictures: [
        {
          picture: require("./img/portfolio01.jpg"),
          alt: "portfolio01",
          pictureClass: "pictureClasslong"
        },
        {
          picture: require("./img/portfolio06.jpg"),
          alt: "portfolio06",
          pictureClass: "pictureClasslong"
        },

        {
          picture: require("./img/portfolio02.jpg"),
          alt: "portfolio02",
          pictureClass: "pictureClasslong"
        },
        {
          picture: require("./img/portfolio03.jpg"),
          alt: "portfolio03",
          pictureClass: "pictureClasslong"
        },
        {
          picture: require("./img/portfolio04.jpg"),
          alt: "portfolio04",
          pictureClass: "pictureClasslong"
        },
        {
          picture: require("./img/portfolio05.jpg"),
          alt: "portfolio05",
          pictureClass: "pictureClasslong"
        }
      ],
      clientsTitle: "Previous Clients",
      clients: [
        {
          picture: require("./img/fiction.png"),
          alt: "fiction"
        },
        {
          picture: require("./img/fiction.png"),
          alt: "fiction"
        },
        {
          picture: require("./img/fiction.png"),
          alt: "fiction"
        },
        {
          picture: require("./img/fiction.png"),
          alt: "fiction"
        },
        {
          picture: require("./img/fiction.png"),
          alt: "fiction"
        },
        {
          picture: require("./img/fiction.png"),
          alt: "fiction"
        }
      ]
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
    blog: {
      indexRoute: "/#newsContainerID",
      postRoute: "/news",
      limit: 4,
      returnLinkText: "All News",
      components: {
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

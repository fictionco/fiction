import { Component } from "vue"
export default {
  headTags: {
    font: `<link href="https://fonts.googleapis.com/css?family=Work+Sans:400,600,700" rel="stylesheet" />`
  },
  metatags: {
    default: {
      image: require("./static/factor-logo.jpg")
    }
  },
  core: {
    components: {
      btn: (): Promise<Component> => import("./el/btn.vue")
    }
  },
  site: {
    logo: (): Promise<Component> => import("./el/logo-ultra.vue"),
    logoTitle: "Ultra Theme",
    nav: [
      {
        name: "Intro",
        path: "#intro",
        target: "intro"
      },
      {
        name: "About",
        path: "#about",
        target: "about"
      },
      {
        name: "Services",
        path: "#services",
        target: "services"
      },
      {
        name: "Portfolio",
        path: "#portfolio",
        target: "portfolio"
      },
      {
        name: "News",
        path: "#news",
        target: "news"
      },
      {
        name: "Contact",
        path: "#contact",
        target: "contact"
      }
    ],
    copyright: "&copy; Copyright "
  },
  intro: {
    pretitle: "Welcome To Ultra",
    title:
      "A modern one page theme for personal or portfolio exposure with unique effects and features.",
    actions: [
      {
        btn: "primary",
        path: "#contact",
        text: "Start a Project",
        icon: "fas fa-right-arrow"
      },
      {
        btn: "primary-ol",
        path: "#about",
        text: "More About Ultra",
        icon: "fas fa-right-arrow"
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
    photo: require("./img/about.jpg"),
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
    ],
    career: {
      title: "Experience &amp; hard work",
      items: [
        {
          left: "Jul 2019 - Today",
          middle: "Senior Designer at Apple",
          right: "Full-time"
        },
        {
          left: "Sep 2018 - Jun 2019",
          middle: "Creative Designer at Asana",
          right: "Full-time"
        },
        {
          left: "Apr 2018 - Sep 2018",
          middle: "Art Director at Google",
          right: "Full-time"
        },
        {
          left: "Feb 2016 - Mar 2018",
          middle: "Art Director at Dropbox",
          right: "Remote"
        },
        {
          left: "Aug 2014 - Jan 2016",
          middle: "Art Director at Twitter",
          right: "Full-time"
        }
      ]
    }
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
    indexRoute: "/#portfolio",
    postRoute: "/portfolio",
    limit: 8,
    returnLinkText: "All Projects",
    notFound: {
      title: "No Projects",
      subTitle: "Couldn't find any projects."
    },
    components: {
      portfolioWrap: (): Promise<Component> => import("./portfolio/portfolio-wrap.vue"),
      portfolioIndex: (): Promise<Component> => import("./portfolio/portfolio-index.vue"),
      portfolioSingle: (): Promise<Component> => import("./portfolio/portfolio-single.vue"),
      portfolioEntry: (): Promise<Component> => import("./portfolio/widget-entry.vue"),
      hero: (): Promise<Component> => import("./portfolio/widget-hero.vue"),
      featuredImage: (): Promise<Component> => import("./portfolio/widget-featured-image.vue"),
      tags: (): Promise<Component> => import("./portfolio/widget-tags.vue")
    },
    layout: {
      index: ["featuredImage"],
      single: ["hero", "featuredImage", "tags", "portfolioEntry"]
    },
    clientsTitle: "Brands we've worked with.",
    clients: [
      {
        picture: require("./img/sennheiser.svg"),
        alt: "sennheiser"
      },
      {
        picture: require("./img/coca-cola.svg"),
        alt: "coca-cola"
      },
      {
        picture: require("./img/adidas.svg"),
        alt: "adidas"
      },
      {
        picture: require("./img/warner.svg"),
        alt: "warner"
      },
      {
        picture: require("./img/netflix.svg"),
        alt: "netflix"
      },
      {
        picture: require("./img/chanel.svg"),
        alt: "chanel"
      }
    ],
    cta: {
      headline: "Interested in Working Together? ",
      path: "/#contact",
      text: "Start Your Project"
    }
  },
  news: {
    pretitle: "News",
    title: "Latest News",
    indexRoute: "/#news",
    postRoute: "/news",
    limit: 4,
    returnLinkText: "All News",
    notFound: {
      title: "No News",
      subTitle: "Couldn't find any news."
    },
    components: {
      newsWrap: (): Promise<Component> => import("./news/news-wrap.vue"),
      newsIndex: (): Promise<Component> => import("./news/news-index.vue"),
      newsSingle: (): Promise<Component> => import("./news/news-single.vue"),
      newsEntry: (): Promise<Component> => import("./news/widget-entry.vue"),
      newsExcerpt: (): Promise<Component> => import("./news/widget-excerpt.vue"),
      newsHero: (): Promise<Component> => import("./news/widget-hero.vue"),
      date: (): Promise<Component> => import("./news/widget-date.vue"),
      featuredImage: (): Promise<Component> => import("./news/widget-featured-image.vue"),
      authorBio: (): Promise<Component> => import("./news/widget-author-bio.vue"),
      tags: (): Promise<Component> => import("./news/widget-tags.vue")
    },
    layout: {
      index: ["date", "newsHero", "newsExcerpt"],
      single: ["newsHero", "featuredImage", "tags", "newsEntry", "authorBio"]
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

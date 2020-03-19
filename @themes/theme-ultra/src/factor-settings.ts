import { Component } from "vue"
export default {
  headTags: {
    font: `<link href="https://fonts.googleapis.com/css?family=Work+Sans:400,600,700" rel="stylesheet" />`
  },
  metatags: {
    defaultTitle: "Ultra",
    titleTemplate: "%s - Factor JS"
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
        _item: "intro",
        path: "#intro",
        name: "Intro",
        target: "_self"
      },
      {
        _item: "about",
        path: "#about",
        name: "About",
        target: "_self"
      },
      {
        _item: "services",
        path: "#services",
        name: "Services",
        target: "_self"
      },
      {
        _item: "portfolio",
        path: "#portfolio",
        name: "Portfolio",
        target: "_self"
      },
      {
        _item: "news",
        path: "#news",
        name: "News",
        target: "_self"
      },
      {
        _item: "contact",
        path: "#contact",
        name: "Contact",
        target: "_self"
      }
    ],
    copyright: "&copy; YourCompany Inc. "
  },
  intro: {
    pretitle: "Welcome To Ultra",
    title:
      "A multi-purpose creative theme for increased exposure with unique effects and features.",
    buttons: [
      {
        _item: "contact",
        link: "/#contact",
        text: `Start a project  <i class="fas fa-arrow-right"></i>`,
        classes: "btn bg-red-500 text-white hover:bg-red-700 hover:text-white"
      },
      {
        _item: "work",
        link: "/#portfolio",
        text: "View work",
        classes:
          "btn border border-solid border-white text-white hover:bg-white hover:text-red-500"
      }
    ],
    metatags: {
      index: {
        title: "Intro - Factor Ultra Theme",
        description: "A simple portfolio theme for Factor.js framework.",
        image: require("./img/logo-ultra.jpg")
      }
    }
  },
  about: {
    pretitle: "About Me",
    title: "Professional Summary",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
    photo: require("./img/about.jpg"),
    career: {
      title: "Experience &amp; hard work",
      items: [
        {
          _item: "item_1",
          left: "Jul 2019 - Today",
          middle: "Senior Designer at Apple",
          right: "Full-time"
        },
        {
          _item: "item_2",
          left: "Sep 2018 - Jun 2019",
          middle: "Creative Designer at Asana",
          right: "Full-time"
        },
        {
          _item: "item_3",
          left: "Apr 2018 - Sep 2018",
          middle: "Art Director at Google",
          right: "Full-time"
        },
        {
          _item: "item_4",
          left: "Feb 2016 - Mar 2018",
          middle: "Art Director at Dropbox",
          right: "Remote"
        },
        {
          _item: "item_5",
          left: "Aug 2014 - Jan 2016",
          middle: "Art Director at Twitter",
          right: "Full-time"
        }
      ]
    },
    counter: [
      {
        _item: "item_1",
        text: "Awards Received",
        number: "56"
      },
      {
        _item: "item_2",
        text: "Projects",
        number: "127"
      },
      {
        _item: "item_3",
        text: "Cups of Coffee",
        number: "876"
      },
      {
        _item: "item_4",
        text: "Happy Clients",
        number: "96"
      }
    ],
    metatags: {
      index: {
        title: "About - Factor Ultra Theme",
        description: "Professional Summary.",
        image: require("./img/logo-ultra.jpg")
      }
    }
  },
  services: {
    pretitle: "What I Do",
    title: "Everything you need to launch and grow your business",
    items: [
      {
        _item: "illustration",
        title: "Illustration",
        text:
          "Nemo cupiditate ab quibusdam quaer impedit magni. Earum suscipit ipsum laudantium cupiditate.",
        icon: "illustration"
      },
      {
        _item: "branding",
        title: "Branding",
        text:
          "Nemo cupiditate ab quibusdam quaer impedit magni. Earum suscipit ipsum laudantium cupiditate.",
        icon: "branding"
      },
      {
        _item: "marketing",
        title: "Marketing",
        text:
          "Nemo cupiditate ab quibusdam quaer impedit magni. Earum suscipit ipsum laudantium cupiditate.",
        icon: "marketing"
      },
      {
        _item: "web_development",
        title: "Web Development",
        text:
          "Nemo cupiditate ab quibusdam quaer impedit magni. Earum suscipit ipsum laudantium cupiditate.",
        icon: "webdev"
      }
    ],
    metatags: {
      index: {
        title: "Services - Factor Ultra Theme",
        description: "Everything you need to launch and grow your business.",
        image: require("./img/logo-ultra.jpg")
      }
    }
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
      portfolioSingle: (): Promise<Component> =>
        import("./portfolio/portfolio-single.vue"),
      portfolioEntry: (): Promise<Component> => import("./portfolio/widget-entry.vue"),
      hero: (): Promise<Component> => import("./portfolio/widget-hero.vue"),
      featuredImage: (): Promise<Component> =>
        import("./portfolio/widget-featured-image.vue"),
      tags: (): Promise<Component> => import("./portfolio/widget-tags.vue")
    },
    layout: {
      index: ["featuredImage"],
      single: ["hero", "featuredImage", "tags", "portfolioEntry"]
    },
    clientsTitle: "Brands we've worked with.",
    clients: [
      {
        _item: "sennheiser",
        picture: require("./img/sennheiser.svg"),
        alt: "sennheiser"
      },
      {
        _item: "coca-cola",
        picture: require("./img/coca-cola.svg"),
        alt: "coca-cola"
      },
      {
        _item: "adidas",
        picture: require("./img/adidas.svg"),
        alt: "adidas"
      },
      {
        _item: "warner",
        picture: require("./img/warner.svg"),
        alt: "warner"
      },
      {
        _item: "netflix",
        picture: require("./img/netflix.svg"),
        alt: "netflix"
      },
      {
        _item: "chanel",
        picture: require("./img/chanel.svg"),
        alt: "chanel"
      }
    ],
    metatags: {
      index: {
        title: "Portfolio - Factor Ultra Theme",
        description: "Check out some of the latest creative work.",
        image: require("./img/logo-ultra.jpg")
      }
    }
  },
  blog: {
    indexRoute: "/#news",
    postRoute: "/news",
    limit: 10,
    returnLinkText: "Back",
    headline: "Latest News",
    subheadline: "Discover The Latest",
    content: "Thoughts on design, the process of creation, and optimizing collaboration.",
    components: {
      blogIndex: (): Promise<Component> => import("./blog/blog-index.vue"),
      blogSingle: (): Promise<Component> => import("./blog/blog-single.vue"),
      blogHero: (): Promise<Component> => import("./blog/widget-hero.vue"),
      date: (): Promise<Component> => import("./blog/widget-date.vue"),
      featuredImage: (): Promise<Component> => import("./blog/el-featured-image.vue"),
      readMore: (): Promise<Component> => import("./blog/widget-read-more.vue"),
      authorDate: (): Promise<Component> => import("./blog/widget-author-date.vue"),
      customSingleHeader: (): Promise<Component> => import("./blog/el-single-header.vue"),
      social: (): Promise<Component> => import("./blog/widget-social.vue")
    },
    layout: {
      index: ["featuredImage", "date", "blogHero", "subtitle", "readMore"],
      single: [
        "customSingleHeader",
        "meta",
        "featuredImage",
        "entry",
        "social",
        "authorBio"
      ],
      meta: ["authorDate", "tags"]
    },
    notFound: {
      title: "No Posts",
      subTitle: "Couldn't find any news posts."
    },
    metatags: {
      index: {
        title: "News - Factor Ultra Theme",
        description:
          "Thoughts on design, the process of creation, and optimizing collaboration.",
        image: require("./img/logo-ultra.jpg")
      }
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
        placeholder: "Your state",
        _id: "state",
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
          _item: "address",
          title: "Address",
          text: "123 Main St. Mountain View, Ca 94043"
        },
        {
          _item: "email",
          title: "Email me",
          text: "contact@fiction.com"
        },
        {
          _item: "phone",
          title: "Call",
          text: "(+1) 619-777-7777"
        }
      ]
    },
    metatags: {
      index: {
        title: "Contact - Factor Ultra Theme",
        description: "Reach out for a new project or just say hello",
        image: require("./img/logo-ultra.jpg")
      }
    }
  }
}

import { Component } from "vue"
export default {
  headTags: {
    font: `<link href="https://fonts.googleapis.com/css?family=Poppins:400,700" rel="stylesheet" />`
  },
  site: {
    logo: (): Promise<Component> => import("./el/logo.vue"),
    nav: [
      {
        _item: "intro",
        path: "/",
        name: "Intro"
      },
      {
        _item: "about",
        path: "/about",
        name: "About"
      },
      {
        _item: "work",
        path: "/work",
        name: "Work"
      },
      {
        _item: "blog",
        path: "/blog",
        name: "Blog"
      },
      {
        _item: "contact",
        path: "/contact",
        name: "Contact"
      }
    ],
    social: [
      {
        _item: "dribbble",
        path: "https://dribbble.com/raylopezaleman",
        icon: "fab fa-dribbble"
      },
      {
        _item: "behance",
        path: "https://behance.com/",
        icon: "fab fa-behance"
      },
      {
        _item: "instagram",
        path: "https://www.instagram.com/raylopezaleman/",
        icon: "fab fa-instagram"
      },
      {
        _item: "twitter",
        path: "https://twitter.com/raylopezaleman",
        icon: "fab fa-twitter"
      },
      {
        _item: "linkedin",
        path: "https://www.linkedin.com/in/raylopezaleman/",
        icon: "fab fa-linkedin"
      }
    ],
    cta: {
      headline: "Let’s create something extraordinary", //For work inquiries, collaboration or feedback
      path: "/contact",
      text: "Get in Touch"
    }
  },
  footer: {
    legal: `&copy; 2020 <a href="https://www.fiction.com/" target="_blank">Fiction.com</a> Inc.`,
    nav: [
      {
        _item: "terms",
        path: "https://www.fiction.com/terms-of-service",
        text: "Terms of Service"
      },
      {
        _item: "privacy",
        path: "https://www.fiction.com/privacy-policy",
        text: "Privacy Policy"
      }
    ]
  },
  home: {
    component: (): Promise<Component> => import("./home/v-home.vue"),
    intro: {
      component: (): Promise<Component> => import("./home/intro.vue"),
      pretitle: "Alpha Theme",
      title: "Hello, I’m Alpha. <br>A minimal, personal or portfolio theme.",
      content:
        "Built with focus on a minimal and functional interface that delivers a bold visual experience.",
      buttons: [
        {
          _item: "contact",
          link: "/contact",
          text: `Start a Project  <i class="fas fa-arrow-right"></i>`,
          classes: "btn rounded-full bg-white text-blue-500 hover:bg-blue-100"
        },
        {
          _item: "work",
          link: "/work",
          text: "View Work",
          classes:
            "btn rounded-full border border-solid border-white text-white hover:bg-white hover:text-blue-500"
        }
      ]
    },
    section2: {
      id: "services",
      pretitle: "Services",
      title: "Tailored Digital Experiences", //Services 
      items: [
        {
          _item: "branding",
          icon: require("./img/icon-branding.svg"),
          title: "Branding",
          content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.`
        },
        {
          _item: "uiux-design",
          icon: require("./img/icon-ux.svg"),
          title: "UI/UX Design",
          content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.`
        },
        {
          _item: "frontend-development",
          icon: require("./img/icon-web.svg"),
          title: "Front-end Development",
          content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.`
        },
        {
          _item: "prototyping",
          icon: require("./img/icon-prototype.svg"),
          title: "Prototyping",
          content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.`
        }
      ]
    },
    section3: {
      id: "work",
      pretitle: "Latest Projects",
      title: "Work",
      buttons: [
        {
          _item: "work",
          link: "/work",
          text: `View All Projects <i class="fas fa-arrow-right"></i>`,
          classes: "btn rounded-full bg-blue-500 text-white hover:bg-blue-700"
        }
      ]
    },
    section4: {
      id: "testimonials",
      pretitle: "Testimonials",
      title: "Success Stories",
      content: "We’re humbled to be working with such a great variety of clients that range from early stage startups to Fortune 500 companies.",
      items: [
        {
          _item: "testimonial_1",
          image: require("./img/andrew.jpg"),
          author: "Raymond Brennan",
          info: "CEO, Lorem ipsum",
          content: `@Alpha designed and fully managed our migration to #productA and on-premises enterprise deployments. Absolutely fantastic!`
        },
        {
          _item: "testimonial_2",
          content: `Original, Creative and with an inborn understanding of their customer's needs. Alpha is always a pleasure to work with.`,
          image: require("./img/ray.jpg"),
          author: "Raymond Hodges",
          info: "CEO, Fiction Technologies"
        }
      ]
    },
    // Client options are under "About" page settings
    // Call to action settings are under "Site" settings above
    meta: {
      title: "Factor Alpha Theme",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions."
    }
  },
  about: {
    pretitle: "About",
    title: "Designer and Illustrator based in San Francisco.",
    content:
      "Alpha is an award-winning designer and art director based in San Francisco. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    heroImage: require("./img/about.jpg"),
    clients: {
      id: "clients",
      pretitle: "Clients",
      title: "Worked with great brands.",
      content: "I'm humbled to be working with such a great variety of clients that range from early stage startups to Fortune 500 companies.",
      items: [
        {
          _item: "adidas",
          link: "https://www.adidas.com/",
          target: "_blank",
          image: require("./img/adidas.svg"),
          alt: "Adidas"
        },
        {
          _item: "beats",
          link: "https://www.beatsbydre.com/",
          target: "_blank",
          image: require("./img/beats.svg"),
          alt: "Beats"
        },
        {
          _item: "cocacola",
          link: "https://www.coca-cola.com/",
          target: "_blank",
          image: require("./img/coca-cola.svg"),
          alt: "Coca Cola"
        },
        {
          _item: "omega",
          link: "https://www.omegawatches.com/",
          target: "_blank",
          image: require("./img/omega.svg"),
          alt: "Omega"
        },
        {
          _item: "playstation",
          link: "https://www.playstation.com/",
          target: "_blank",
          image: require("./img/playstation.svg"),
          alt: "Playstation"
        },
        {
          _item: "toggl",
          link: "https://toggl.com/",
          target: "_blank",
          image: require("./img/toggl.svg"),
          alt: "Toggl"
        },
        {
          _item: "tacobell",
          link: "https://www.tacobell.com/",
          target: "_blank",
          image: require("./img/taco-bell.svg"),
          alt: "Taco Bell"
        },
        {
          _item: "lexus",
          link: "https://www.lexus.com/",
          target: "_blank",
          image: require("./img/lexus.svg"),
          alt: "Lexus"
        },
        {
          _item: "verizon",
          link: "https://www.verizon.com/",
          target: "_blank",
          image: require("./img/verizon.svg"),
          alt: "Verizon"
        },
        {
          _item: "paris",
          link: "https://en.psg.fr/",
          target: "_blank",
          image: require("./img/paris.svg"),
          alt: "Paris"
        },
        {
          _item: "manchestercity",
          link: "https://www.mancity.com/",
          target: "_blank",
          image: require("./img/city.svg"),
          alt: "Manchester City"
        },
        {
          _item: "salomon",
          link: "https://www.salomon.com/en-us",
          target: "_blank",
          image: require("./img/salomon.svg"),
          alt: "Salomon"
        }
      ]
    },
    meta: {
      title: "Factor Alpha Theme",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions."
    }
  },
  work: {
    headline: "Work",
    subheadline: "Case Studies",
    content:
      "Great products happen with passion, intelligence, and personal commitment.",
    meta: {
      title: "Work - Factor Alpha Theme",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions."
    },
    indexRoute: "/work",
    postRoute: "/work",
    limit: 4,
    returnLinkText: "Back to Work Projects",
    components: {
      workWrap: (): Promise<Component> => import("./work/work-wrap.vue"),
      workIndex: (): Promise<Component> => import("./work/work-index.vue"),
      workSingle: (): Promise<Component> => import("./work/work-single.vue"),
      workFeaturedImage: (): Promise<Component> => import("./work/el-featured-image.vue"),
      workHeader: (): Promise<Component> => import("./work/el-headers.vue"),
      workReturnLink: (): Promise<Component> => import("./work/el-return-link.vue"),
      workTags: (): Promise<Component> => import("./work/el-tags.vue"),
      workEntry: (): Promise<Component> => import("./work/el-entry.vue"),
      workPagination: (): Promise<Component> => import("./work/el-pagination.vue")
    },
    layout: {
      index: ["workFeaturedImage", "workHeader"],
      single: ["workReturnLink", "workHeader", "workFeaturedImage", "workTags", "workEntry"] //"workTags",
    }
  },
  blog: {
    indexRoute: "/blog",
    postRoute: "/entry",
    limit: 6,
    returnLinkText: "Back",
    headline: "Blog",
    subheadline: "Discover The Latest",
    content:
      "Product updates, articles, and announcements.",
    notFound: {
      title: "No Posts",
      subTitle: "Couldn't find any blog posts."
    },
    components: {
      blogWrap: (): Promise<Component> => import("./blog/blog-wrap.vue"),
      blogIndex: (): Promise<Component> => import("./blog/blog-index.vue"),
      blogSingle: (): Promise<Component> => import("./blog/blog-single.vue"),
      featuredImage: (): Promise<Component> => import("./blog/el-featured-image.vue"),
      singleHeader: (): Promise<Component> => import("./blog/el-single-header.vue"),
      pagination: (): Promise<Component> => import("./blog/widget-pagination.vue")
    },
    layout: {
      index: ["featuredImage", "title", "subtitle", "authorDate"],
      single: ["singleHeader", "featuredImage", "meta", "entry", "social", "authorBio"]
    },
    meta: {
      index: {
        title: "Blog - The Latest from Factor Alpha Theme",
        description:
          "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions."
      }
    }
  },
  contact: {
    headline: "Contact",
    subheadline: "Let's Talk!",
    content:
      "Drop me a note and I’ll get back to you within 24 hours. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
    heroImage: require("./img/contact.jpg"),
    form: {
      namePlaceholder: "Name",
      emailPlaceholder: "Email Address",
      messagePlaceholder: "Message",
      buttonText: "Contact"
    },
    meta: {
      title: "Contact - Factor Alpha Theme",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions."
    },
  }
}

import { Component } from "vue"
export default {
  headTags: {
    font: `<link href="https://fonts.googleapis.com/css?family=Poppins:400,700" rel="stylesheet" />`
  },
  metatags: {
    defaultTitle: "Alpha",
    titleTemplate: "%s - Factor JS"
  },
  site: {
    components: {
      header: (): Promise<Component> => import("./header.vue"),
      footer: (): Promise<Component> => import("./footer.vue")
    },
    logo: (): Promise<Component> => import("./el/logo.vue"),
    /**
     * Site navigation.
     */
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
    /**
     * Site social links.
     */
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
    /**
     * Copy for the call to action on the home page, work page, and about page.
     */
    cta: {
      headline: "Let’s create something extraordinary",
      path: "/contact",
      text: "Get in Touch"
    }
  },
  /**
   * Site footer settings.
   */
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
  /**
   * Copy for the home page template.
   */
  home: {
    component: (): Promise<Component> => import("./home/v-home.vue"),
    intro: {
      component: (): Promise<Component> => import("./home/intro.vue"),
      pretitle: "Alpha Theme",
      title: "Hello, I’m Alpha. <br>A minimal portfolio theme.",
      content:
        "Built with focus on a minimal and functional interface that delivers a bold visual experience.",
      buttons: [
        {
          _item: "contact",
          link: "/contact",
          text: `Start a Project  <i class="fas fa-arrow-right"></i>`,
          classes: "btn rounded-full bg-blue-500 text-white hover:bg-blue-700"
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
      /**
       * Home page "Services" section.
       */
      id: "services",
      pretitle: "Services",
      title: "Tailored Digital Experiences",
      items: [
        {
          _item: "service_1",
          icon: require("./img/icon-branding.svg"),
          title: "Branding",
          content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.`
        },
        {
          _item: "service_2",
          icon: require("./img/icon-ux.svg"),
          title: "UI/UX Design",
          content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.`
        },
        {
          _item: "service_3",
          icon: require("./img/icon-web.svg"),
          title: "Front-end Development",
          content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.`
        },
        {
          _item: "service_4",
          icon: require("./img/icon-prototype.svg"),
          title: "Prototyping",
          content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.`
        }
      ]
    },
    section3: {
      /**
       * Home page "work" section.
       * Note: Post settings of this section are managed via the "work" page settings
       */
      id: "work",
      pretitle: "Work",
      title: "Latest Projects",
      buttons: [
        {
          _item: "work",
          link: "/work",
          text: `View All Projects <i class="fas fa-arrow-right"></i>`,
          classes: "btn rounded-full bg-blue-500 text-white hover:bg-blue-700"
        }
      ],
      limit: 4 // Post limit
    },
    section4: {
      /**
       * Home page "Testimonials" section.
       */
      id: "testimonials",
      pretitle: "Testimonials",
      title: "Success Stories",
      items: [
        {
          _item: "testimonial_1",
          image: require("./img/client1.jpg"),
          content: `&ldquo; @Alpha designed and fully managed our migration to #productA and on-premises enterprise deployments. Absolutely fantastic! &rdquo;`,
          author: "Kate Brennan",
          info: "CEO, Sed Laudantium"
        },
        {
          _item: "testimonial_2",
          image: require("./img/client2.jpg"),
          content: `&ldquo; Original, Creative and with an inborn understanding of their customer's needs. Alpha is always a pleasure to work with. &rdquo;`,
          author: "Sebastian Hodges",
          info: "CEO, Lorem ipsum"
        }
      ]
    },
    /**
     * Home page client logos are set via the "About" page settings below.
     */
    metatags: {
      title: "Factor Alpha Theme",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions.",
      image: require("./img/logo-alpha.jpg")
    }
  },
  /**
   * Copy for the about page template.
   */
  about: {
    component: (): Promise<Component> => import("./v-about.vue"),
    pretitle: "About",
    title: "Designer and Illustrator based in San Francisco.",
    content:
      "Alpha is an award-winning designer and art director based in San Francisco. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    heroImage: require("./img/about.jpg"),
    clients: {
      id: "clients",
      pretitle: "Clients",
      title: "Worked with great brands.",
      content:
        "I'm humbled to be working with such a great variety of clients that range from early stage startups to Fortune 500 companies.",
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
    metatags: {
      title: "About - Factor Alpha Theme",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions.",
      image: require("./img/logo-alpha.jpg")
    }
  },
  /**
   * Copy for the work page template.
   */
  work: {
    indexRoute: "/work",
    postRoute: "/work",
    limit: 4,
    returnLinkText: "Back to All Projects",
    pretitle: "Work",
    title: "Case Studies",
    content: "Great projects happen with passion, intelligence, and personal commitment.",
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
      single: [
        "workReturnLink",
        "workHeader",
        "workFeaturedImage",
        "workEntry",
        "workTags"
      ]
    },
    metatags: {
      index: {
        title: "Work - Factor Alpha Theme",
        description: "The latest work.",
        image: require("./img/logo-alpha.jpg")
      }
    },
    templateSettings: [
      {
        _id: "bullets",
        input: "sortable",
        label: "Additional Work Info",
        description: "Additional information about this project",
        default: [
          { __title: "Client", value: "Client Name" },
          { __title: "Role", value: "Role" },
          { __title: "Year", value: new Date().getFullYear() },
          { __title: "Platforms", value: "Web" },
          { __title: "URL", value: "https://www.example.com" }
        ],
        settings: [
          {
            input: "text",
            label: "Value",
            _id: "value"
          }
        ]
      }
    ]
  },
  /**
   * Copy for the blog page template.c
   */
  blog: {
    indexRoute: "/blog",
    postRoute: "/entry",
    limit: 4,
    returnLinkText: "Back",
    headline: "Blog",
    subheadline: "Discover The Latest",
    content: "Thoughts on design, the process of creation, and optimizing collaboration.",
    components: {
      blogIndex: (): Promise<Component> => import("./blog/blog-index.vue"),
      blogSingle: (): Promise<Component> => import("./blog/blog-single.vue"),
      featuredImage: (): Promise<Component> => import("./blog/el-featured-image.vue"),
      pagination: (): Promise<Component> => import("./blog/widget-pagination.vue"),
      authorDate: (): Promise<Component> => import("./blog/widget-author-date.vue"),
      customSingleHeader: (): Promise<Component> => import("./blog/el-single-header.vue")
    },
    layout: {
      index: ["featuredImage", "title", "subtitle", "authorDate"],
      single: [
        "customSingleHeader",
        "featuredImage",
        "meta",
        "entry",
        "social",
        "authorBio"
      ],
      meta: ["authorDate", "tags"]
    },
    notFound: {
      title: "No Posts",
      subTitle: "Couldn't find any blog posts."
    },
    metatags: {
      index: {
        title: "Blog - Factor Alpha Theme",
        description:
          "Thoughts on design, the process of creation, and optimizing collaboration.",
        image: require("./img/logo-alpha.jpg")
      }
    }
  },
  /**
   * Copy for the contact page template.
   */
  contact: {
    component: (): Promise<Component> => import("./v-contact.vue"),
    pretitle: "Contact",
    title: "Let's Talk!",
    content:
      "A new project is an opportunity to create something unique. Share your idea, drop me a note and I’ll get back to you within 24 hours.",
    heroImage: require("./img/contact.jpg"),
    resources: {
      pretitle: "Looking for something in particular?",
      title: "Resources",
      items: [
        {
          _item: "resource_1",
          title: "Sales",
          content: `Interested in learning more about Alpha? Contact our product experts at <a href="mailto:example@example.com">sales@example.com</a>.`
        },
        {
          _item: "resource_2",
          title: "Support",
          content: `If you don’t find what you need, please submit a support request through <a href="#">github</a>.`
        },
        {
          _item: "resource_3",
          title: "Business Development",
          content: `Are you a reseller or affiliate that would like to partner with Alpha? <a href="mailto:example@example.com">partners@example.com</a>.`
        }
      ]
    },
    location: {
      pretitle: "Location",
      title: "Alpha HQ",
      content: `Feel free to drop by to spot us in our natural habitat. We’ll even pour you some coffee.  <br><br>301 Howard St. #600 <br>San Francisco, CA 94105`,
      button: {
        link: "https://goo.gl/maps/KbqqgPzqJQVL35D39",
        target: "_blank",
        text: "Open in Google Maps",
        classes: "btn rounded-full bg-blue-500 text-white hover:bg-blue-700"
      },
      map: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.014498913255!2d-122.39648858468193!3d37.78969997975663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858173dda8f9e3%3A0xa807172524065c9e!2s301%20Howard%20St%20%23600%2C%20San%20Francisco%2C%20CA%2094105!5e0!3m2!1sen!2sus!4v1581543011803!5m2!1sen!2sus" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen=""></iframe>`
    },
    metatags: {
      title: "Contact - Factor Alpha Theme",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions.",
      image: require("./img/logo-alpha.jpg")
    }
  },
  /**
   * Contact form plugin settings.
   */
  contactForm: {
    //email: "example@email.com",
    submit: {
      btn: "bg-blue-500 text-white hover:bg-blue-700",
      text: "Contact"
    },
    inputFormat: "vertical",
    confirm: {
      title: "Got it!",
      subTitle: "I’ll get back to you as soon as possible."
    },
    layout: [
      {
        label: "Name",
        _id: "name",
        inputType: "text",
        placeholder: "Full Name",
        required: true
      },
      {
        label: "Work Email",
        _id: "email",
        inputType: "email",
        placeholder: "name@example.com",
        required: true
      },
      {
        label: "Message",
        _id: "message",
        inputType: "textarea",
        placeholder: "how can we help?",
        required: true
      }
    ]
  }
}

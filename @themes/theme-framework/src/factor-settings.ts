export default {
  headTags: {
    font: `<link href="https://fonts.googleapis.com/css?family=Archivo+Black|Rubik:400,500&display=swap" rel="stylesheet" />`,
  },
  metatags: {
    defaultTitle: "Framework",
    titleTemplate: "%s - Factor JS",
  },
  site: {
    components: {
      header: (): Promise<any> => import("./header.vue"),
      footer: (): Promise<any> => import("./footer.vue"),
    },
    logo: (): Promise<any> => import("./el/logo.vue"),
    /**
     * Site navigation.
     */
    nav: [
      {
        _item: "home",
        path: "/",
        name: "Home",
      },
      {
        _item: "blog",
        path: "/blog",
        name: "Blog",
      },
      {
        _item: "jobs",
        path: "/jobs",
        name: "Jobs",
      },
      {
        _item: "contact",
        path: "/contact",
        name: "Contact",
      },
    ],
    newsletter: {
      title: "Newsletter",
      content: "Sign up for latest news and important updates.",
    },
  },
  /**
   * home page.
   */
  home: {
    component: (): Promise<any> => import("./v-home.vue"),
    splash: {
      title: "Get Started Fast",
      subtitle:
        "Framework theme is lightweight, uncluttered and simple.<br /> Focused on functionality to help you start building your new app.",
      buttons: [
        {
          _item: "get_framework",
          link: "https://factor.dev/theme/framework-factor-theme",
          text: "Get Framework Theme",
          btn: "primary",
          target: "_blank"
        },
      ],
      image: require("./img/canyon.jpg"),
    },
    features: [
      {
        _item: "customizable",
        title: "Customizable",
        content: `Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut.`,
      },
      {
        _item: "easy-to-use",
        title: "Easy to use",
        content: `Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut.`,
      },
      {
        _item: "rapid",
        title: "Rapid Development",
        content: `Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut.`,
      },
      {
        _item: "documentation",
        title: "Great Documentation",
        content: `Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut.`,
      },
      {
        _item: "saves-time",
        title: "Saves Time",
        content: `Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut.`,
      },
      {
        _item: "extension-library",
        title: "Extension Library",
        content: `Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut.`,
      }
    ],
    metatags: {
      title: "Factor Framework Theme",
      description:
        "Starter theme meant to be worked with, tweaked, and styled. Focused on simplicity and just enough functionality to help you start building your new app.",
      //image: require("./img/logo-alpha.jpg"),
    },
  },
  /**
   * Email list plugin.
   */
  emailList: {
    default: {
      form: {
        buttonText: "Join Newsletter",
      },
    },
  },
  /**
   * Blog Page.
   */
  blog: {
    title: "Blog",
    subtitle: "Product updates, articles, and announcements.",
    limit: 4,
    components: {
      blogIndex: (): Promise<any> => import("./blog/blog-index.vue"),
      blogSingle: (): Promise<any> => import("./blog/blog-single.vue"),
    },
  },
  jobs: {
    //component: (): Promise<any> => import("./v-jobs.vue"),
    title: "Jobs",
    subtitle: "Check Current Openings",
    limit: 4,
    components: {
      jobsIndex: (): Promise<any> => import("./jobs/jobs-index.vue"),
      jobsSingle: (): Promise<any> => import("./jobs/jobs-single.vue")
    },
  },
  /**
   * Jobs Page.
   */
  // jobsNEW: {
  //   indexRoute: "/careers",
  //   postRoute: "/careers",
  //   limit: 6,
  //   returnLinkText: "All Jobs",
  //   metatags: {
  //     index: {
  //       title: "Fiction Jobs - Building Apps, Code, Remote Work",
  //       description: "Fiction jobs.",
  //     },
  //   },
  //   notFound: {
  //     title: "No Posts",
  //     subTitle: "Couldn't find any job posts.",
  //   },
  //   layout: {
  //     index: ["featuredImage", "title", "synopsis"],
  //     single: ["singleHeader", "entry", "cta"],
  //   },
  //   components: {
  //     jobsWrap: (): Promise<any> => import("./jobs/wrap.vue"),
  //     jobsIndex: (): Promise<any> => import("./jobs/index.vue"),
  //     jobsSingle: (): Promise<any> => import("./jobs/single.vue"),
  //     singleHeader: (): Promise<any> => import("./jobs/single-header.vue"),
  //     cta: (): Promise<any> => import("./jobs/cta.vue"),
  //   },
  // },
  /**
   * Contact Page.
   */
  contact: {
    component: (): Promise<any> => import("./v-contact.vue"),
    title: "Contact",
    subtitle: "Fill out the form and we’ll be in touch as soon as possible."
  },
  /** Contact Form Plugin. */
  contactForm: {
    //email: "example@email.com"
    inputFormat: "vertical"
  },
  /**
   * Site footer settings.
   */
  footer: {
    legal: `Framework Theme &copy; 2020 <a href="https://www.fiction.com/" target="_blank">Fiction.com</a> Inc.`,
    social: [
      {
        _item: "dribbble",
        path: "https://dribbble.com/raylopezaleman",
        icon: "fab fa-dribbble",
      },
      {
        _item: "behance",
        path: "https://behance.com/",
        icon: "fab fa-behance",
      },
      {
        _item: "instagram",
        path: "https://www.instagram.com/raylopezaleman/",
        icon: "fab fa-instagram",
      },
      {
        _item: "twitter",
        path: "https://twitter.com/factor_js",
        icon: "fab fa-twitter",
      },
      {
        _item: "linkedin",
        path: "https://www.linkedin.com/in/raylopezaleman/",
        icon: "fab fa-linkedin",
      },
    ],
  }
}

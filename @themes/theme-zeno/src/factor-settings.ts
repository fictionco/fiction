export default {
  /**
   * Add custom font to app
   */
  headTags: {
    font:
      '<link href="https://fonts.googleapis.com/css?family=Maven+Pro:400,600,700&display=swap" rel="stylesheet" />',
  },
  /**
   * Tailwind CSS Config
   */
  tailwind: {
    config: require("./tailwind.config.js"),
    directives: require("./tailwind.css"),
  },
  metatags: {
    defaultTitle: "Zeno",
    titleTemplate: "%s - Factor JS",
  },

  /**
   * Global Theme Settings
   */
  site: {
    components: {
      header: (): Promise<any> => import("./header.vue"),
      footer: (): Promise<any> => import("./footer.vue"),
    },
    logo: require("./img/logo-zeno.svg"),
    logoInverse: require("./img/logo-zeno-inverse.svg"),
    nav: [
      {
        _item: "home",
        path: "/",
        name: "Home",
      },
      {
        _item: "solutions",
        path: "/#solutions",
        name: "Solutions",
      },
      {
        _item: "pricing",
        path: "/pricing",
        name: "Pricing",
      },
      {
        _item: "about",
        path: "/about",
        name: "About",
      },
      {
        _item: "blog",
        path: "/blog",
        name: "Blog",
      },
      {
        _item: "contact",
        path: "/contact",
        name: "Contact",
      },
      {
        _item: "dashboard",
        path: "/dashboard",
        name: "Dashboard &rarr;",
      },
    ],
    /**
     * Copy for the call to action on the home page, pricing page, and about page.
     */
    cta: {
      title: "Get better results with Zeno",
      content: `Save time and start with a solid foundation, then customize. <i class="fas fa-rocket"></i>`,
      buttons: [
        {
          _item: "contact",
          link: "/contact",
          text: "Free Consultation",
          classes: "btn bg-gray-100 rounded text-purple-500 hover:bg-gray-300",
        },
      ],
      figure: require("./img/cloud-with-shadow.svg"),
      footerFigureAlt: "Cloud",
    },
  },
  /**
   * Copy for the home page template.
   */
  home: {
    component: (): Promise<any> => import("./home/v-home.vue"),
    intro: {
      component: (): Promise<any> => import("./home/intro.vue"),
      title: "Welcome to Zeno, <br>SaaS Factor Theme",
      content:
        "Zeno is a minimalist theme suited for the needs of start-ups, tech businesses and SaaS companies. Styles are powered by Tailwind, a low-level CSS framework.",
      buttons: [
        {
          _item: "contact",
          link: "/contact",
          text: "Contact Us",
          classes: "btn mr-4 text-purple-100 bg-purple-500 hover:bg-purple-600",
        },
        {
          _item: "pricing",
          link: "/pricing",
          text: "Pricing",
          classes:
            "btn btn-ol border-purple-700 ml-0 mt-4 md:mt-0 hover:text-purple-500 hover:border-purple-500",
        },
      ],
      figure: require("./img/intro.svg"),
    },
    logos: {
      title: "Working with the following clouds:",
      list: [
        {
          _item: "aws",
          link: "https://aws.amazon.com/",
          target: "_blank",
          image: require("./img/aws.svg"),
          alt: "Amazon Web Services",
        },
        {
          _item: "google",
          link: "https://cloud.google.com/",
          target: "_blank",
          image: require("./img/google-cloud-platform.svg"),
          alt: "Google Cloud Platform",
        },
        {
          _item: "digitalocean",
          link: "https://www.digitalocean.com/",
          target: "_blank",
          image: require("./img/digital-ocean.svg"),
          alt: "Digital Ocean",
        },
      ],
    },
    section3: {
      id: "solutions",
      items: [
        {
          _item: "plan",
          icon: require("./img/plan.svg"),
          title: "Plan",
          content: `Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut`,
        },
        {
          _item: "build",
          icon: require("./img/build.svg"),
          title: "Build",
          content: `Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut`,
        },
        {
          _item: "manage",
          icon: require("./img/manage.svg"),
          title: "Manage",
          content: `Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut`,
        },
        {
          _item: "gears",
          icon: require("./img/gears.svg"),
          title: "Automation",
          content: `Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut`,
        },
        {
          _item: "clouds",
          icon: require("./img/clouds.svg"),
          title: "Cloud",
          content: `Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut`,
        },
        {
          _item: "security",
          icon: require("./img/security.svg"),
          title: "Security",
          content: `Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut`,
        },
      ],
    },
    section4: {
      id: "software-as-a-service",
      pretitle: "Software-as-a-Service",
      title: "The last software you'll need!",
      content: `<p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia.</p>`,
      buttons: [
        {
          _item: "contact",
          link: "/contact",
          text: "Contact Us",
          classes:
            "factor-link factor-link btn bg-purple-500 rounded text-white hover:bg-purple-600",
        },
      ],
      figure: (): Promise<any> => import("./el/figure-devops.vue"),
    },
    section5: {
      id: "software-as-code",
      pretitle: "Open Source",
      title: "Product A + Product B = ",
      titleIcon: require("./img/custom-heart.svg"),
      items: [
        {
          _item: "producta",
          image: require("./img/logo-producta.svg"),
          alt: "Product A",
          content: `Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.`,
        },
        {
          _item: "productb",
          image: require("./img/logo-productb.svg"),
          alt: "Product B",
          content: `Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.`,
        },
      ],
      syntaxTitle: "mycode.ts",
      syntax: (): Promise<any> => import("./el/figure-infrastructure.vue"),
    },
    testimonials: {
      pretitle: "Success Stories",
      title: "Our customers love what we do!",
      items: [
        {
          _item: "testimonial_1",
          content: `@Zeno designed and fully managed our migration to #productA and on-premises enterprise deployments. They've been absolutely fantastic!`,
          image: require("./img/member4.jpg"),
          author: "Kate Brennan",
          info: "CEO, Lorem ipsum",
        },
        {
          _item: "testimonial_2",
          content: `@Zeno designed and fully managed our migration to #productB and on-premises enterprise deployments. They've been absolutely fantastic!`,
          image: require("./img/member3.jpg"),
          author: "Sebastian Hodges",
          info: "CEO, SedLaudantium",
        },
      ],
    },
    meta: {
      title: "Factor Zeno Theme",
      description:
        "Zeno is a minimalist theme suited for the needs of IT companies and tech startups. Styles are powered by Tailwind, a low-level CSS framework.",
      image: require("./img/logo-zeno.jpg"),
    },
  },
  /**
   * Settings for the about page template
   */
  about: {
    hero: {
      pretitle: "About Theme Zeno",
      title: "Built with Factor CMS",
      content: `Zeno is a minimalist theme suited for the needs of IT companies and tech startups. Zeno styles are powered by Tailwind, a low-level CSS framework.`,
    },
    valuesImage1: require("./img/about1.jpg"),
    valuesImage2: require("./img/about2.jpg"),
    valuesTitle: "A company with core values:",
    values: [
      {
        _item: "simplicity",
        title: "Simplicity",
        content:
          "Do more with less. Given the choice, choose minimization over maximization.",
      },
      {
        _item: "karma",
        title: "Karma",
        content:
          "Be as altruistic as possible. History has proven that karma works in mysterious ways.",
      },
      {
        _item: "humility",
        title: "Humility",
        content:
          "Continually assess and reassess the things you believe & actions you're taking. Never assume.",
      },
    ],
    team: {
      /**
       * The team layout has "grid" or "list" options
       */
      layout: "list",
      pretitle: "Meet the Minds",
      title: `The Team`,
      members: [
        {
          _item: "member_1",
          photo: require("./img/member1.jpg"),
          title: "Co-Founder",
          name: "Zeno Elea 1",
          content:
            "custom element Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit",
          links: [
            {
              _item: "link_1",
              path: "https://www.linkedin.com/",
              icon: "fab fa-linkedin",
              target: "_blank",
            },
            {
              _item: "link_2",
              path: "https://github.com/",
              icon: "fab fa-github",
              target: "_blank",
            },
            {
              _item: "link_3",
              path: "https://angel.co/",
              icon: "fab fa-angellist",
              target: "_blank",
            },
          ],
        },
        {
          _item: "member_2",
          photo: require("./img/member2.jpg"),
          title: "Co-Founder",
          name: "Zeno Elea",
          content:
            "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit",
        },
        {
          _item: "member_3",
          photo: require("./img/member3.jpg"),
          title: "Managing Partner",
          name: "Zeno Elea",
          content:
            "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit",
        },
        {
          _item: "member_4",
          photo: require("./img/member4.jpg"),
          title: "Managing Partner",
          name: "Zeno Elea",
          content:
            "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit",
        },
        {
          _item: "member_5",
          photo: require("./img/member5.jpg"),
          title: "Managing Partner",
          name: "Zeno Elea",
          content:
            "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit",
        },
        {
          _item: "member_6",
          photo: require("./img/member6.jpg"),
          title: "Managing Partner",
          name: "Zeno Elea",
          content:
            "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit",
        },
      ],
    },
    meta: {
      title: "About - Factor Zeno Theme",
      description:
        "Zeno is a minimalist theme suited for the needs of IT companies and tech startups. Zeno styles are powered by Tailwind, a low-level CSS framework.",
      image: require("./img/logo-zeno.jpg"),
    },
  },
  // Pricing Page
  pricing: {
    hero: {
      pretitle: "Pricing that scales with your business.",
      title: `Awesome Plans`,
      content:
        "Choose the plan that suits your needs.",
    },
    packages: [
      {
        classes: "md:mt-6",
        name: "Starter",
        description: "All the basics for businesses that are just getting started.",
        price: `$199 <span class="text-base">per month</span>`,
        list: [
          {
            content: "At vero eos et accusamus",
          },
          {
            content: "Et iusto odio dignissimos",
          },
          {
            content: `Ducimus qui blanditiis`,
          },
          {
            content: "Lorem ipsum dolor sit",
          },
          {
            content: "Omnis iste natus error sit",
          },
        ],
        buttonLink: "/contact",
        buttonText: "Contact Us",
        buttonClasses:
          "btn btn-ol border-purple-700 hover:text-purple-500  hover:border-purple-500",
      },
      {
        name: "Pro",
        description: "Better insights for growing businesses that want more customers.",
        price: `$499 <span class="text-base">per month</span>`,
        list: [
          {
            content: "Voluptatem accusantium",
          },
          {
            content: "Omnis iste natus error",
          },
          {
            content: "Sed ut perspiciatis unde",
          },
          {
            content: "Lorem ipsum dolor sit",
          },
          {
            content: "Incididunt ut labore et dolore magna aliqua",
          },
        ],
        buttonLink: "/contact",
        buttonText: "Contact Us",
        buttonClasses: "btn text-purple-100 bg-purple-500 hover:bg-purple-600",
      },
      {
        classes: "md:mt-6",
        name: "Business",
        description: "Advanced features for pros who need more customization.",
        price: `$899 <span class="text-base">per month</span>`,
        list: [
          {
            content: "Nam libero tempore",
          },
          {
            content: "Soluta nobis est eligendi",
          },
          {
            content: `Optio cumque nihil`,
          },
          {
            content: "Lorem ipsum dolor sit",
          },
          {
            content: "Consectetur adipiscing elit amet",
          },
        ],
        buttonLink: "/contact",
        buttonText: "Contact Us",
        buttonClasses:
          "btn btn-ol border-purple-700 hover:text-purple-500  hover:border-purple-500",
      },
    ],
    packagesFooter:
      "* 10 day money back guarantee",
    faq: {
      title: "FAQs",
      questions: [
        {
          _item: "q1",
          title: "Can I buy a lower tier and upgrade later?",
          content: `Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia.`,
        },
        {
          _item: "q2",
          title: "What if I don't like it?",
          content: `Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia.`,
        },
        {
          _item: "q3",
          title: "Can I cancel at anytime?",
          content: `Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia.`,
        },
        {
          _item: "q4",
          title: "What happens if I go over my plans included hours?",
          content: `Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia.`,
        },
        {
          _item: "q5",
          title: "Who is this for?",
          content: `Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia.`,
        },
        {
          _item: "q6",
          title: "Are there any discounts available?",
          content: `Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia.`,
        },
      ],
    },
    meta: {
      title: "Pricing - Factor Zeno Theme",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions.",
      image: require("./img/logo-zeno.jpg"),
    },
  },
  // Contact Page
  contact: {
    hero: {
      pretitle: "Contact Us",
      title: "Give us a shout. Let us know how we can help.",
      content:
        "We'd love to hear about your business and find a time to discuss your needs. Fill out the form and we will be in touch shortly.",
    },
    meta: {
      title: "Contact - Factor Zeno Theme",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions.",
      image: require("./img/logo-zeno.jpg"),
    },
  },
  // Contact form plugin settings
  contactForm: {
    submit: {
      btn: "m-0",
      size: "m-0",
      text: "Contact",
    },
    inputFormat: "vertical",
    confirm: {
      title: "Got it!",
      subTitle: "We’ll get back to you as soon as possible.",
    },
    layout: [
      {
        label: "Name",
        _id: "name",
        inputType: "text",
        placeholder: "Full Name",
        required: true,
      },
      {
        label: "Work Email",
        _id: "email",
        inputType: "email",
        placeholder: "name@example.com",
        required: true,
      },
      {
        label: "Message",
        _id: "message",
        inputType: "textarea",
        placeholder: "how can we help?",
        required: true,
      },
    ],
  },
  // Blog plugin and custom blog Settings
  blog: {
    pretitle: "Because the future comes fast",
    title: "Zeno Blog",
    content:
      "Discover the latest product updates, announcements, and articles from the Zeno team",
    indexRoute: "/blog",
    postRoute: "/entry",
    limit: 6,
    returnLinkText: "Back",
    notFound: {
      title: "No Posts",
      subTitle: "Couldn't find any blog posts.",
    },
    promo: {
      pretitle: "Built with Factor CMS",
      title: "About Theme Zeno",
      content:
        "Zeno is a minimalist theme suited for the needs of IT companies and tech startups. Zeno styles are powered by Tailwind, a low-level CSS framework.",
      button: {
        link: "/about",
        text: "Learn More",
        classes: "btn bg-gray-100 rounded text-purple-500 hover:text-purple-600",
      },
    },
    components: {
      blogIndex: (): Promise<any> => import("./blog/blog-index.vue"),
      blogSingle: (): Promise<any> => import("./blog/blog-single.vue"),
      featuredImage: (): Promise<any> => import("./blog/el-featured-image.vue"),
      title: (): Promise<any> => import("./blog/widget-title.vue"),
      date: (): Promise<any> => import("./blog/widget-date.vue"),
      author: (): Promise<any> => import("./blog/widget-author.vue"),
      singleHeader: (): Promise<any> => import("./blog/el-single-header.vue"),
      entry: (): Promise<any> => import("./blog/widget-entry.vue"),
      social: (): Promise<any> => import("./blog/widget-social.vue"),
      pagination: (): Promise<any> => import("./blog/widget-pagination.vue"),
    },
    layout: {
      index: ["featuredImage", "date", "title", "author"],
      single: ["singleHeader", "entry", "social"],
    },
    metatags: {
      index: {
        title: "Blog - The Latest from Zeno Theme",
        description:
          "Discover the latest product updates, announcements, and articles from the Zeno team",
        image: require("./img/logo-zeno.jpg"),
      },
    },
  },
  // Footer
  footer: {
    nav: [
      {
        _item: "home",
        path: "/",
        name: "Home",
      },
      {
        _item: "pricing",
        path: "/pricing",
        name: "Pricing",
      },
      {
        _item: "about",
        path: "/about",
        name: "About",
      },
      {
        _item: "about",
        path: "/blog",
        name: "Blog",
      },
      {
        _item: "contact",
        path: "/contact",
        name: "Contact",
      },
      {
        _item: "twitter",
        path: "https://twitter.com/",
        icon: "fab fa-twitter",
        target: "_blank",
      },
    ],
    left: `Built with <i class="fas fa-heart"></i> and <a href='https://factor.dev/' target='_blank'>Factor</a>`,
    right: `&copy 2020 <a href='https://www.fiction.com/' target='_blank'>Fiction, Inc.</a>`, // Empty when blank (e.g. right: '') or Dynamically added if removed/commented.
    figure: require("./img/cloud-with-shadow.svg"),
    figureAlt: "Cloud",
  },
}

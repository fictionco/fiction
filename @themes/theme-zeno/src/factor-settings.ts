import { Component } from "vue"
export default {
  /**
   * Add custom font to app
   */
  headTags: {
    font:
      '<link href="https://fonts.googleapis.com/css?family=Maven+Pro:400,600,700&display=swap" rel="stylesheet" />'
  },
  /**
   * Tailwind CSS Config
   */
  tailwind: {
    config: require("./tailwind.config.js"),
    directives: require("./tailwind.css")
  },
  metatags: {
    defaultTitle: "Zeno",
    titleTemplate: "%s - Factor JS"
  },

  /**
   * Global Theme Settings
   */
  site: {
    components: {
      header: (): Promise<Component> => import("./header.vue"),
      footer: (): Promise<Component> => import("./footer.vue")
    },
    logo: require("./img/logo-zeno.svg"),
    logoInverse: require("./img/logo-zeno-inverse.svg"),
    nav: [
      {
        _item: "home",
        path: "/",
        name: "Home"
      },
      {
        _item: "solutions",
        path: "/#solutions",
        name: "Solutions"
      },
      {
        _item: "pricing",
        path: "/pricing",
        name: "Pricing"
      },
      {
        _item: "about",
        path: "/about",
        name: "About"
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
      },
      {
        _item: "dashboard",
        path: "/dashboard",
        name: "Dashboard &rarr;"
      }
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
          classes: "btn bg-gray-100 rounded text-purple-500 hover:bg-gray-300"
        }
      ],
      figure: require("./img/cloud-with-shadow.svg"),
      footerFigureAlt: "Cloud"
    }
  },
  /**
   * Copy for the home page template.
   */
  home: {
    component: (): Promise<Component> => import("./home/v-home.vue"),
    intro: {
      component: (): Promise<Component> => import("./home/intro.vue"),
      title: "Welcome to Zeno, <br>SaaS Factor Theme",
      content:
        "Zeno is a minimalist theme suited for the needs of start-ups, tech businesses and SaaS companies. Styles are powered by Tailwind, a low-level CSS framework.",
      buttons: [
        {
          _item: "contact",
          link: "/contact",
          text: "Contact Us",
          classes: "btn mr-4 text-purple-100 bg-purple-500 hover:bg-purple-600"
        },
        {
          _item: "pricing",
          link: "/pricing",
          text: "Pricing",
          classes:
            "btn btn-ol border-purple-700 ml-0 mt-4 md:mt-0 hover:text-purple-500 hover:border-purple-500"
        }
      ],
      figure: require("./img/intro.svg")
    },
    logos: {
      title: "Working with the following clouds:",
      list: [
        {
          _item: "aws",
          link: "https://aws.amazon.com/",
          target: "_blank",
          image: require("./img/aws.svg"),
          alt: "Amazon Web Services"
        },
        {
          _item: "google",
          link: "https://cloud.google.com/",
          target: "_blank",
          image: require("./img/google-cloud-platform.svg"),
          alt: "Google Cloud Platform"
        },
        {
          _item: "digitalocean",
          link: "https://www.digitalocean.com/",
          target: "_blank",
          image: require("./img/digital-ocean.svg"),
          alt: "Digital Ocean"
        }
      ]
    },
    section3: {
      id: "solutions",
      items: [
        {
          _item: "plan",
          icon: require("./img/plan.svg"),
          title: "Plan",
          content: `Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut`
        },
        {
          _item: "build",
          icon: require("./img/build.svg"),
          title: "Build",
          content: `Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut`
        },
        {
          _item: "manage",
          icon: require("./img/manage.svg"),
          title: "Manage",
          content: `Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut`
        },
        {
          _item: "gears",
          icon: require("./img/gears.svg"),
          title: "Automation",
          content: `Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut`
        },
        {
          _item: "clouds",
          icon: require("./img/clouds.svg"),
          title: "Cloud",
          content: `Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut`
        },
        {
          _item: "security",
          icon: require("./img/security.svg"),
          title: "Security",
          content: `Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut`
        }
      ]
    },
    section4: {
      id: "software-as-a-service",
      pretitle: "Software-as-a-Service",
      title: "The last software you'll need!",
      content: `<p>By leveraging our decades of experience, we'll help you focus on what's important… Growing your business.</p><p class="mt-4">Zeno will handle uptime, security, cost optimization, disaster recovery, and performance. We’re always on-call, ready to assist. Focused on being responsive, transparent, and thorough.</p>`,
      buttons: [
        {
          _item: "contact",
          link: "/contact",
          text: "Contact Us",
          classes:
            "factor-link factor-link btn bg-purple-500 rounded text-white hover:bg-purple-600"
        }
      ],
      figure: (): Promise<Component> => import("./el/figure-devops.vue")
    },
    section5: {
      id: "software-as-code",
      pretitle: "Open Source",
      title: "Product A + Product B = ",
      titleIcon: require("./img/custom-heart.svg"),
      items: [
        {
          _item: "packer",
          image: require("./img/logo-packer.svg"),
          alt: "XYZ Corp Product",
          content: `<p>Product A automates the creation of machine images across cloud providers.</p><p class="mt-4">It embraces modern configuration management by utilizing automated scripts to install and configure software within images.</p>`
        },
        {
          _item: "terraform",
          image: require("./img/logo-terraform.svg"),
          alt: "XYZ Corp Product",
          content: `<p>Product B codifies infrastructure and resources, replacing manual point and click with a simple and intuitive declarative configuration.</p><p class="mt-4">Confidently apply reproducible infrastructure transformations. Humans make mistakes and forget details, machines and code don't.</p>`
        }
      ],
      syntaxTitle: "terraform.tf",
      syntax: (): Promise<Component> => import("./el/figure-infrastructure.vue")
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
          info: "CEO, Lorem ipsum"
        },
        {
          _item: "testimonial_2",
          content: `@Zeno designed and fully managed our migration to #productB and on-premises enterprise deployments. They've been absolutely fantastic!`,
          image: require("./img/member3.jpg"),
          author: "Sebastian Hodges",
          info: "CEO, SedLaudantium"
        }
      ]
    },
    meta: {
      title: "Factor Zeno Theme",
      description:
        "Zeno is a minimalist theme suited for the needs of IT companies and tech startups. Styles are powered by Tailwind, a low-level CSS framework.",
      image: require("./img/logo-zeno.jpg")
    }
  },
  /**
   * Settings for the about page template
   */
  about: {
    hero: {
      pretitle: "About Theme Zeno",
      title: "Built with Factor CMS",
      content: `Zeno is a minimalist theme suited for the needs of IT companies and tech startups. Zeno styles are powered by Tailwind, a low-level CSS framework.`
    },
    valuesImage1: require("./img/about1.jpg"),
    valuesImage2: require("./img/about2.jpg"),
    valuesTitle: "A company with core values:",
    values: [
      {
        _item: "simplicity",
        title: "Simplicity",
        content:
          "Do more with less. Given the choice, choose minimization over maximization."
      },
      {
        _item: "karma",
        title: "Karma",
        content:
          "Be as altruistic as possible. History has proven that karma works in mysterious ways."
      },
      {
        _item: "humility",
        title: "Humility",
        content:
          "Continually assess and reassess the things you believe & actions you're taking. Never assume."
      }
    ],
    team: {
      /**
       * The team layout has "grid" or "list" options
       */
      layout: "grid",
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
              path: "https://www.linkedin.com/in/jkell",
              icon: "fab fa-linkedin",
              target: "_blank"
            },
            {
              _item: "link_2",
              path: "https://github.com/nodesocket",
              icon: "fab fa-github",
              target: "_blank"
            },
            {
              _item: "link_3",
              path: "https://angel.co/justink",
              icon: "fab fa-angellist",
              target: "_blank"
            }
          ]
        },
        {
          _item: "member_2",
          photo: require("./img/member2.jpg"),
          title: "Co-Founder",
          name: "Zeno Elea",
          content:
            "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit"
        },
        {
          _item: "member_3",
          photo: require("./img/member3.jpg"),
          title: "Managing Partner",
          name: "Zeno Elea",
          content:
            "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit"
        },
        {
          _item: "member_4",
          photo: require("./img/member4.jpg"),
          title: "Managing Partner",
          name: "Zeno Elea",
          content:
            "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit"
        },
        {
          _item: "member_5",
          photo: require("./img/member5.jpg"),
          title: "Managing Partner",
          name: "Zeno Elea",
          content:
            "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit"
        },
        {
          _item: "member_6",
          photo: require("./img/member6.jpg"),
          title: "Managing Partner",
          name: "Zeno Elea",
          content:
            "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit"
        }
      ]
    },
    meta: {
      title: "About - Factor Zeno Theme",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions.",
      image: require("./img/logo-zeno.jpg")
    }
  },
  // Pricing Page
  pricing: {
    hero: {
      pretitle: "Pricing that scales with your business.",
      title: `Choose the right plan for your business.`,
      content:
        "Three simple monthly plans with hours that can be used for any infrastructure or DevOps related tasks."
    },
    packages: [
      {
        classes: "md:mt-6",
        name: "Basic",
        description: "The full power of Zeno Theme",
        price: `$199 <span class="text-base">per month</span>`,
        list: [
          {
            content: "10 billable hours included monthly"
          },
          {
            content: "$200 per additional hour"
          },
          {
            content: `24/7/365 on-call and 99.9% SLA`
          },
          {
            content: "Lorem ipsum dolor sit"
          },
          {
            content: "Omnis iste natus error sit"
          }
        ],
        buttonLink: "/contact",
        buttonText: "Contact Us",
        buttonClasses:
          "btn btn-ol border-purple-700 hover:text-purple-500  hover:border-purple-500"
      },
      {
        name: "Pro",
        description: "Great value for growing businesses",
        price: `$399 <span class="text-base">per month</span>`,
        list: [
          {
            content: "20 billable hours included monthly"
          },
          {
            content: "$250 per additional hour"
          },
          {
            content: "24/7/365 on-call and 99.9% SLA"
          },
          {
            content: "Lorem ipsum dolor sit"
          },
          {
            content: "Incididunt ut labore et dolore magna aliqua"
          }
        ],
        buttonLink: "/contact",
        buttonText: "Contact Us",
        buttonClasses: "btn text-purple-100 bg-purple-500 hover:bg-purple-600"
      },
      {
        classes: "md:mt-6",
        name: "Enterprise",
        description: "Infrastructure at scale",
        price: `$799 <span class="text-base">per month</span>`,
        list: [
          {
            content: "40 billable hours included monthly"
          },
          {
            content: "$150 per additional hour"
          },
          {
            content: `24/7/365 on-call and 99.9% SLA`
          },
          {
            content: "Lorem ipsum dolor sit"
          },
          {
            content: "Consectetur adipiscing elit amet"
          }
        ],
        buttonLink: "/contact",
        buttonText: "Contact Us",
        buttonClasses:
          "btn btn-ol border-purple-700 hover:text-purple-500  hover:border-purple-500"
      }
    ],
    packagesFooter:
      "* Tasks are billed in half-hour increments with a half-hour minimum.",
    faq: {
      title: "Billing FAQs",
      questions: [
        {
          _item: "q1",
          title: "How are payments handled?",
          content: `<p>We process all payments via Stripe and offer two payment options.</p><ul class="font-normal list-outside list-square mt-8 ml-8 text-base leading-relaxed lg:text-xl"><li>ACH debit bank transfer. (US only)</li><li> All major credit cards. Note, there is a 3% processing fee for credit card transactions.</li></ul>`
        },
        {
          _item: "q2",
          title: "Who pays for infrastructure and 3rd party services?",
          content: `To prevent any vendor lock-in, you do. All infrastructure and cloud costs are still under your payment method of choice. If we recommend a 3rd party service, you'll signup, provide your own billing details, and then give us credentials/access to the service.`
        },
        {
          _item: "q3",
          title: "Can I cancel at anytime?",
          content: `We require a three month commitment at the start, but after that all of our plans are month-to-month so you may cancel at any time. As a courtesy, we can provide a detailed "exit briefing" to the new party taking over.`
        },
        {
          _item: "q4",
          title: "What happens if I go over my plans included hours?",
          content: `After you've utilized your plans included hours, you will be billed at your plans billable hourly rate above.`
        },
        {
          _item: "q5",
          title: "Do you have smaller plans with less billable hours?",
          content: `Unfortunately no. The Basic plan is the smallest plan we can offer while maintaining a high level of quality service.`
        },
        {
          _item: "q6",
          title: "Do you offer annual billing?",
          content: `Yes, and we offer a discount for up-front annual billing. Please contact us for details.`
        }
      ]
    },
    meta: {
      title: "Pricing - Factor Zeno Theme",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions.",
      image: require("./img/logo-zeno.jpg")
    }
  },
  // Contact Page
  contact: {
    hero: {
      pretitle: "Contact Us",
      title: "Give us a shout. Let us know how we can help.",
      content:
        "We'd love to hear about your business and find a time to discuss your needs. Fill out the form and we will be in touch shortly."
    },
    meta: {
      title: "Contact - Factor Zeno Theme",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions.",
      image: require("./img/logo-zeno.jpg")
    }
  },
  // Contact form plugin settings
  contactForm: {
    submit: {
      btn: "m-0",
      size: "m-0",
      text: "Contact"
    },
    inputFormat: "vertical",
    confirm: {
      title: "Got it!",
      subTitle: "We’ll get back to you as soon as possible."
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
      subTitle: "Couldn't find any blog posts."
    },
    promo: {
      pretitle: "Built with Factor CMS",
      title: "About Theme Zeno",
      content:
        "Zeno is a minimalist theme suited for the needs of IT companies and tech startups. Zeno styles are powered by Tailwind, a low-level CSS framework.",
      button: {
        link: "/about",
        text: "Learn More",
        classes: "btn bg-gray-100 rounded text-purple-500 hover:text-purple-600"
      }
    },
    components: {
      blogIndex: (): Promise<Component> => import("./blog/blog-index.vue"),
      blogSingle: (): Promise<Component> => import("./blog/blog-single.vue"),
      featuredImage: (): Promise<Component> => import("./blog/el-featured-image.vue"),
      title: (): Promise<Component> => import("./blog/widget-title.vue"),
      date: (): Promise<Component> => import("./blog/widget-date.vue"),
      author: (): Promise<Component> => import("./blog/widget-author.vue"),
      singleHeader: (): Promise<Component> => import("./blog/el-single-header.vue"),
      entry: (): Promise<Component> => import("./blog/widget-entry.vue"),
      social: (): Promise<Component> => import("./blog/widget-social.vue"),
      pagination: (): Promise<Component> => import("./blog/widget-pagination.vue")
    },
    layout: {
      index: ["featuredImage", "date", "title", "author"],
      single: ["singleHeader", "entry", "social"]
    },
    metatags: {
      index: {
        title: "Blog - The Latest from Zeno Theme",
        description:
          "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions.",
        image: require("./img/logo-zeno.jpg")
      }
    }
  },
  // Footer
  footer: {
    nav: [
      {
        _item: "home",
        path: "/",
        name: "Home"
      },
      {
        _item: "pricing",
        path: "/pricing",
        name: "Pricing"
      },
      {
        _item: "about",
        path: "/about",
        name: "About"
      },
      {
        _item: "about",
        path: "/blog",
        name: "Blog"
      },
      {
        _item: "contact",
        path: "/contact",
        name: "Contact"
      },
      {
        _item: "twitter",
        path: "https://twitter.com/",
        icon: "fab fa-twitter",
        target: "_blank"
      }
    ],
    left: `Built with <i class="fas fa-heart"></i> and <a href='https://factor.dev/' target='_blank'>Factor</a>`,
    right: `&copy 2020 <a href='https://www.fiction.com/' target='_blank'>Fiction, Inc.</a>`, // Empty when blank (e.g. right: '') or Dynamically added if removed/commented.
    figure: require("./img/cloud-with-shadow.svg"),
    figureAlt: "Cloud"
  }
}

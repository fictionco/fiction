import { Component } from "vue"
export default {
  headTags: {
    //font: `<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600&display=swap" rel="stylesheet" />`
    font: `<link href="https://fonts.googleapis.com/css?family=Maven+Pro:400,600,700&display=swap" rel="stylesheet" />`
  },
  tailwind: {
    config: require("./tailwind.config.js"),
    directives: require("./tailwind.css")
  },
  site: {
    logo: require("./img/logo-zeno.svg"),
    logoInverse: require("./img/logo-zeno-inverse.svg"), // Optional
    nav: [
      {
        path: "/",
        name: "Home"
      },
      {
        path: "/#solutions",
        name: "Solutions"
      },
      // {
      //   path: "/#devops-as-a-service",
      //   name: "Devops-as-a-Service  "
      // },
      // {
      //   path: "/#infrastructure-as-code",
      //   name: "Infrastructure as Code"
      // },
      {
        path: "/pricing",
        name: "Pricing"
      },
      {
        path: "/about",
        name: "About"
      },
      {
        path: "/blog",
        name: "Blog"
      },
      {
        path: "/contact",
        name: "Contact"
      }
    ],
    cta: {
      title: "Get better results with Zeno",
      buttons: [
        {
          link: "/contact",
          text: "Free Consultation",
          classes: "btn bg-gray-100 rounded text-purple-500 hover:bg-gray-300"
        }
      ],
      figure: require("./img/cloud-with-shadow.svg"),
      figureAlt: "Cloud"
    }
  },
  home: {
    meta: {
      title: "Factor Zeno Theme",
      description:
        "Zeno is a minimalist theme suited for the needs of IT companies and tech startups. Styles are powered by Tailwind, a low-level CSS framework.",
      image: require("./img/logo-zeno.jpg")
    },
    intro: {
      title: "Welcome to Zeno, <br>Innovation via Automation",//`<span class="underline">Grow Your Business</span>, Not Infrastructure.`,
      content:
        "Zeno is a minimalist theme suited for the needs of cloud service and technology companies. Styles are powered by Tailwind, a low-level CSS framework.",
      buttons: [
        {
          link: "/contact",
          text: "Contact Us",
          classes: "btn text-purple-100 bg-purple-500 hover:bg-purple-600"
        },
        {
          link: "/pricing",
          text: "Pricing",
          classes: "ml-4 btn btn-ol border-purple-700 hover:text-purple-500  hover:border-purple-500" //text-purple-700 border-purple-700 ml-4 hover:text-purple-500 hover:border-purple-500 hover:bg-gray-100"
        }
      ],
      figure: (): Promise<Component> => import("./el/figure-intro.vue")
    },
    clients: {
      title: "Working with the following clouds:",
      list: [
        {
          link: "https://aws.amazon.com/",
          target: "_blank",
          image: require("./img/aws.svg"),
          alt: "Amazon Web Services"
        },
        {
          link: "https://cloud.google.com/",
          target: "_blank",
          image: require("./img/google-cloud-platform.svg"),
          alt: "Google Cloud Platform"
        },
        {
          link: "https://www.digitalocean.com/",
          target: "_blank",
          image: require("./img/digital-ocean.svg"),
          alt: "Digital Ocean"
        }
      ]
    },
    solutions: {
      id: "solutions",
      items: [
        {
          icon: require("./img/plan.svg"),
          title: "Plan",
          content: "Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut"
        },
        {
          icon: require("./img/build.svg"),
          title: "Build",
          content: "Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut"
        },
        {
          icon: require("./img/manage.svg"),
          title: "Manage",
          content: "Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut"
        },
        {
          icon: require("./img/build.svg"),
          title: "Automation",
          content: "Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut"
        },
        {
          icon: require("./img/manage.svg"),
          title: "Cloud",
          content: "Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut"
        },
        {
          icon: require("./img/plan.svg"),
          title: "Security",
          content: "Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut"
        }
      ]
    },
    devops: {
      id: "devops-as-a-service",
      pretitle: "Devops-as-a-Service",
      title: "Your first and last DevOps!",
      content: `<p>By leveraging our decades of DevOps and sysadmin experience, we'll help you focus on what's important… Growing your business.</p><p class="mt-4">Zeno will handle uptime, security, cost optimization, disaster recovery, and performance. We’re always on-call, ready to assist. Focused on being responsive, transparent, and thorough.</p>`,
      buttons: [
        {
          link: "/contact",
          text: "Contact Us",
          classes: "factor-link factor-link btn bg-purple-500 rounded text-white hover:bg-purple-600"
        }
      ],
      // list: [
      //   {
      //     text:
      //       "Plan"
      //   },
      //   {
      //     text:
      //       "Code"
      //   },
      //   {
      //     text:
      //       "Build"
      //   },
      //   {
      //     text:
      //       "Test"
      //   },
      //   {
      //     text:
      //       "Release"
      //   },
      //   {
      //     text:
      //       "Deploy"
      //   },
      //   {
      //     text:
      //       "Operate"
      //   },
      //   {
      //     text:
      //       "Monitor"
      //   }
      // ],
      figure: (): Promise<Component> => import("./el/figure-devops.vue")
    },
    infrastructure: {
      id: "infrastructure-as-code",
      pretitle: "Infrastructure as Code",
      title: "Packer + Terraform = ",
      titleIcon: require("./img/custom-heart.svg"),
      items: [
        {
          image: require("./img/logo-packer.svg"),
          alt: "HashiCorp Packer",
          content: `<p>Packer automates the creation of machine images across cloud providers.</p><p class="mt-4">It embraces modern configuration management by utilizing automated scripts to install and configure software within images.</p>`
        },
        {
          image: require("./img/logo-terraform.svg"),
          alt: "HashiCorp Terraform",
          content: `<p>Terraform codifies infrastructure and resources, replacing manual point and click with a simple and intuitive declarative configuration.</p><p class="mt-4">Confidently apply reproducible infrastructure transformations. Humans make mistakes and forget details, machines and code don't.</p>`
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
          content: `@Zeno designed and fully managed our migration to #kubernetes and on-premises enterprise deployments. They've been absolutely fantastic!`,
          image: require("./img/client.svg"),
          author: "Will Norton",
          info: "CEO, SimplyAgree"
        },
        {
          content:
            "@Zeno designed and fully managed our migration to #kubernetes and on-premises enterprise deployments. They've been absolutely fantastic!",
          image: require("./img/client.svg"),
          author: "Will Norton",
          info: "CEO, SimplyAgree"
        }
      ]
    }
  },
  about: {
    hero: {
      pretitle: "About Theme Zeno",
      title:
        "Built with Factor CMS",
      content:
        "Zeno is a minimalist theme suited for the needs of IT companies and tech startups. Zeno styles are powered by Tailwind, a low-level CSS framework."
    },
    valuesTitle: "A technology company with core values:",
    values: [
      {
        title: "Simplicity",
        content: "Do more with less. Given the choice, choose minimization over maximization."
      },
      {

        title: "Karma",
        content: "Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut"
      },
      {

        title: "Humility",
        content: "Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut"
      },
      {
        title: "Trust",
        content: "Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut"
      }
    ],
    team: {
      title: "Leadership",
      members: [
        {
          photo: require("./img/justin.jpg"),
          social: [
            {
              link: "https://twitter.com/",
              icon: "twitter",
              target: "_blank"
            },
            {
              link: "https://www.linkedin.com/",
              icon: "linkedin",
              target: "_blank"
            },
            {
              link: "https://github.com/",
              icon: "github",
              target: "_blank"
            },
            {
              link: "https://angel.co/",
              icon: "angellist",
              target: "_blank"
            }
          ],
          title: "Founder",
          name: "Justin Keller",
          content: `<p>Justin has been programming and managing infrastructure for over a decade and has founded three startups ranging from a hosting company to a Node.js platform as a service to a distributed SSH platform (<a href="https://commando.io/">Commando.io</a>).</p><p class="mt-4">He received his Bachelor of Science in Computer Science from San Diego State University. He's managed cloud infrastructure for Fortune 500 companies powered by Amazon Web Services and Google Cloud.</p>`
        }
      ]
    },
    location: {
      title: "Based in music city; Nashville, Tennessee.",
      figure: (): Promise<Component> => import("./el/figure-location.vue")
    },
    meta: {
      title: "About - Factor Zeno Theme",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions.",
      image: require("./img/logo-zeno.jpg")
    }
  },
  pricing: {
    intro: {
      pretitle: "Pricing that scales with your business.",
      title: `Choose the right plan for your business.`,
      content:
        "Three simple monthly plans with hours that can be used for any infrastructure or DevOps related tasks.",
      backgroundImage: require("./img/light-pattern.svg")
    },
    packages: [
      {
        classes: "border border-gray-400",
        name: "Nano",
        description: "The full power of Zeno Theme",
        list: [
          {
            contentLarge: `$2,000`,
            content: `per month`
          },
          {
            content: `<span class="font-bold">10</span> billable hours included monthly`
          },
          {
            content: `<span class="font-bold">$300</span> per additional hour`
          },
          {
            content: `24/7/365 on-call and 99.9% SLA`
          },
          {
            content: `communication via ticketing system and e-mail.`
          }
        ],
        buttonLink: "/contact",
        buttonText: "Contact Us",
        buttonClasses: "btn bg-teal-500 text-purple-700 hover:bg-teal-600"
      },
      {
        classes: "border border-purple-400 bg-purple-100 -mt-24",
        name: "Micro",
        description: "Great value for growing businesses",
        list: [
          {
            contentLarge: `$3,500`,
            content: `per month`
          },
          {
            content: `<span class="font-bold">20</span> billable hours included monthly`
          },
          {
            content: `<span class="font-bold">$250</span> per additional hour`
          },
          {
            content: `24/7/365 on-call and 99.9% SLA`
          },
          {
            content: `communication via dedicated Slack, video conference, ticketing system and e-mail.`
          }
        ],
        buttonLink: "/contact",
        buttonText: "Contact Us",
        buttonClasses: "btn bg-teal-500 text-purple-700 hover:bg-teal-600"
      },
      {
        classes: "border border-gray-400",
        name: "Mega",
        description: "Infrastructure and DevOps at scale",
        list: [
          {
            contentLarge: `$6,000`,
            content: `per month`
          },
          {
            content: `<span class="font-bold">40</span> billable hours included monthly`
          },
          {
            content: `<span class="font-bold">$200</span> per additional hour`
          },
          {
            content: `24/7/365 on-call and 99.9% SLA`
          },
          {
            content: `communication via dedicated Slack, video conference, ticketing system and e-mail.`
          }
        ],
        buttonLink: "/contact",
        buttonText: "Contact Us",
        buttonClasses: "btn bg-teal-500 text-purple-700 hover:bg-teal-600"
      }
    ],
    packagesFooter:
      "* Tasks are billed in half-hour increments with a half-hour minimum.",
    faq: {
      title: "Billing FAQs",
      questions: [
        {
          title: "How are payments handled?",
          content: `<p>We process all payments via Stripe and offer two payment options.</p><ul class="font-normal list-outside list-square mt-8 ml-8 text-base leading-relaxed lg:text-xl"><li>ACH debit bank transfer. (US only)</li><li> All major credit cards. Note, there is a 3% processing fee for credit card transactions.</li></ul>`
        },
        {
          title: "Who pays for infrastructure and 3rd party services?",
          content: `To prevent any vendor lock-in, you do. All infrastructure and cloud costs are still under your payment method of choice. If we recommend a 3rd party service, you'll signup, provide your own billing details, and then give us credentials/access to the service.`
        },
        {
          title: "Can I cancel at anytime?",
          content: `We require a three month commitment at the start, but after that all of our plans are month-to-month so you may cancel at any time. As a courtesy, we can provide a detailed "exit briefing" to the new party taking over.`
        },
        {
          title: "What happens if I go over my plans included hours?",
          content: `After you've utilized your plans included hours, you will be billed at your plans billable hourly rate above.`
        },
        {
          title: "Do you have smaller plans with less billable hours?",
          content: `Unfortunately no. The NANO plan is the smallest plan we can offer while maintaining a high level of quality service.`
        },
        {
          title: "Do you offer annual billing?",
          content: `Yes, and we offer a discount for up-front annual billing. Please contact us for details.`
        },
        {
          title: "Can I change plans at any time?",
          content: `Sure, you can upgrade and downgrade plans at any time we only ask for 30 days notice when downgrading.`
        },
        {
          title: "We require an invoice, do you send one?",
          content: `Yes, we send an invoice each month of service.`
        },
        {
          title: "How are tasks billed?",
          content: `Tasks are billed in half-hour increments with a half-hour minimum. For example, a task that takes us 15 minutes to complete would be billed as ½ hour.`
        },
        {
          title: "Do you accept clients outside of the United States?",
          content: `Absolutely.`
        },
        {
          title: "Do you accept credit cards outside of the United States?",
          content: `Yes. Stripe our payment processor accepts all major international credit cards.`
        },
        {
          title: "Are ACH debit bank transfers outside of the United States supported?",
          content: `Unfortunately not. ACH debit is only supported by US bank accounts.`
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
  contact: {
    hero: {
      pretitle: "Contact Us",
      title: "Give us a shout. Let us know how we can help.",
      content:
        "We'd love to hear about your business and find a time to discuss your needs. Fill out the form and we will be in touch shortly.",
    },
    intro: {
      pretitle: "Contact Us",
      title: "Give us a shout. Let us know how we can help.",
      content:
        "We'd love to hear about your business and find a time to discuss your needs. Fill out the form and we will be in touch shortly.",
      figure: require("./img/cloud-with-shadow.svg"),
      backgroundImage: require("./img/stars-50.svg")
    },
    meta: {
      title: "Contact - Factor Zeno Theme",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions.",
      image: require("./img/logo-zeno.jpg")
    }
  },
  contactForm: {
    submit: {
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
  blog: {
    pretitle: "Because the future comes fast",
    title: "Zeno Blog",
    content:
      "Discover the latest product updates, announcements, and articles from the Zeno team"
    ,
    indexRoute: "/blog",
    postRoute: "/entry",
    limit: 3,
    returnLinkText: "Back",
    notFound: {
      title: "No Posts",
      subTitle: "Couldn't find any blog posts."
    },
    promo: {
      pretitle: "Built with Factor CMS",
      title:
        "About Theme Zeno",
      content:
        "Zeno is a minimalist theme suited for the needs of IT companies and tech startups. Zeno styles are powered by Tailwind, a low-level CSS framework.",
      button: {
        link: "/about",
        text: "Learn More",
        classes: "btn bg-gray-100 rounded text-purple-500 hover:text-purple-600"
      }
    },
    components: {
      blogWrap: (): Promise<Component> => import("./blog/blog-wrap.vue"),
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
      single: [
        "singleHeader",
        "entry",
        "social",
      ]
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
  footer: {
    nav: [
      {
        path: "/",
        name: "Home"
      },
      {
        path: "/pricing",
        name: "Pricing"
      },
      {
        path: "/about",
        name: "About"
      },
      {
        path: "/blog",
        name: "Blog"
      },
      {
        path: "/contact",
        name: "Contact"
      },
      {
        path: "https://twitter.com/",
        icon: "twitter",
        target: "_blank"
      }
    ],
    left: `Built with <i class="fa fa-heart"></i>`,
    right:
      "<p>&copy; 2020 <a href='https://www.fiction.com/' target='_blank'>Fiction, Inc.</a></p>",
    figure: require("./img/cloud-with-shadow.svg"),
    figureAlt: "Cloud"
  }
}

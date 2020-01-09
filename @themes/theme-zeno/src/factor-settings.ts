import { Component } from "vue"
export default {
  headTags: {
    font: `<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600&display=swap" rel="stylesheet" />`
    //font: `<link href="https://fonts.googleapis.com/css?family=Cabin:400,600,700&display=swap" rel="stylesheet" />`
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
      {
        path: "/#devops-as-a-service",
        name: "Devops-as-a-Service  "
      },
      {
        path: "/#infrastructure-as-code",
        name: "Infrastructure as Code"
      },
      {
        path: "/pricing",
        name: "Pricing"
      }
    ],
    cta: {
      title: "Get better results with Zeno",
      buttons: [
        {
          link: "/contact",
          text: "Contact Us",
          classes: "btn bg-purple-500 rounded text-white hover:bg-purple-600"
        },
        {
          link: "/pricing",
          text: "Pricing",
          classes:
            "factor-link btn rounded border border-purple-300 text-purple-300 ml-4 hover:text-purple-100 hover:border-purple-300"
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
      pretitle: "Grow Your Business, Not Infrastructure.",
      title: `<span class="underline">Grow Your Business</span>, Not Infrastructure.`,
      content:
        "Zeno is a minimalist theme suited for the needs of IT companies and tech startups. Styles are powered by Tailwind, a low-level CSS framework.",
      buttons: [
        {
          link: "/contact",
          text: "Contact Us",
          classes: "factor-link btn bg-purple-500 rounded text-white hover:bg-purple-600"
        },
        {
          link: "/pricing",
          text: "Pricing",
          classes: "btn rounded text-purple-700 border border-purple-700 ml-4 hover:text-purple-500 hover:border-purple-500 hover:bg-gray-100"
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
      // title: "Solutions",
      // titleFigure: require("./img/squares.svg"),
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
          title: "Something",
          content: "Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut"
        },
        {
          icon: require("./img/manage.svg"),
          title: "Else",
          content: "Lorem ipsum dolor sit amet, labore et dolore adipiscing elit, sed do eiusmod tempor incididunt ut"
        },
        {
          icon: require("./img/plan.svg"),
          title: "Placeholder",
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
          content: `<p>Packer automates the creation of machine images across cloud providers.</p><p class="mt-4">It embraces modern configuration management by utilizing automated scripts to install and configure software within images.</p><p class="mt-4">Produces exact point-in-time images with multi-region replication support.</p>`
        },
        {
          image: require("./img/logo-terraform.svg"),
          alt: "HashiCorp Terraform",
          content: `<p>Terraform codifies infrastructure and resources, replacing manual point and click with a simple and intuitive declarative configuration.</p><p class="mt-4">Confidently apply reproducible infrastructure transformations. Humans make mistakes and forget details, machines and code don't.</p><p class="mt-4">Terraform configurations can be stored in version control, shared, and collaborated on by teams.</p>`
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
    meta: {
      title: "About - Factor Zeno Theme",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions.",
      image: require("./img/logo-zeno.jpg")
    },
    intro: {
      pretitle: "About Us",
      title:
        "Elastic Byte is a DevOps as a service company which builds, optimizes, secures and supports your cloud.",
      backgroundImage: require("./img/stars-50.svg")
    },
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
    }
  },
  pricing: {
    meta: {
      title: "Pricing - Factor Zeno Theme",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions.",
      image: require("./img/logo-zeno.jpg")
    },
    intro: {
      pretitle: "Pricing that scales with your business.",
      title: `Choose the <span class="underline">right plan</span> for your business.`,
      content:
        "Three simple monthly plans with hours that can be used for any infrastructure or DevOps related tasks.",
      backgroundImage: require("./img/transparent-pattern.svg")
    },
    packages: [
      {
        classes: "border border-gray-400",
        name: "Nano",
        description: "The full power of Elastic Byte",
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
        classes: "border border-purple-400 bg-purple-100",
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
    }
  },
  contact: {
    meta: {
      title: "Contact - Factor Zeno Theme",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions.",
      image: require("./img/logo-zeno.jpg")
    },
    intro: {
      pretitle: "Contact Us",
      title: "Give us a shout. Let us know how we can help.",
      content:
        "We'd love to hear about your business and find a time to discuss your needs. Fill out the form and we will be in touch shortly.",
      figure: require("./img/cloud-with-shadow.svg"),
      backgroundImage: require("./img/stars-50.svg")
    }
  },
  contactForm: {
    submit: {
      btn: "btn bg-teal-500 text-purple-700 hover:bg-teal-600",
      size: "",
      text: "Contact"
    },
    inputFormat: "vertical",
    confirm: {
      title: "Got it!",
      subTitle: "We’ll get back to you as soon as possible."
    },
    layout: [
      {
        label: "Plan Interest",
        labelClasses: "font-bold leading-tight text-xl text-purple-900",
        _id: "plan",
        inputType: "select",
        inputClasses: `bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none leading-normal is-required vertical`,
        required: true,
        list: [
          {
            value: "unsure",
            name: "unsure"
          },
          {
            value: "nano",
            name: "Nano"
          },
          {
            value: "micro",
            name: "Micro"
          },
          {
            value: "mega",
            name: "Mega"
          }
        ]
      },
      {
        label: "Name",
        labelClasses: "font-bold leading-tight text-xl text-purple-900",
        _id: "name",
        inputType: "text",
        classesInput: `thenewstuff`,
        inputClasses:
          "bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none leading-normal is-required vertical",
        placeholder: "Full Name",
        required: true
      },
      {
        label: "Work Email",
        labelClasses: "font-bold leading-tight text-xl text-purple-900",
        _id: "email",
        inputType: "email",
        inputClasses:
          "bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none leading-normal is-required vertical",
        placeholder: "name@example.com",
        required: true
      },
      {
        label: "Message",
        labelClasses: "font-bold leading-tight text-xl text-purple-900",
        _id: "message",
        inputType: "textarea",
        inputClasses:
          "bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none leading-normal is-required vertical",
        placeholder: "how can we help?",
        required: true
      }
    ]
  },
  blog: {
    metatags: {
      index: {
        title: "Blog - The Latest from Zeno Theme",
        description:
          "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions.",
        image: require("./img/logo-zeno.jpg")
      }
    },
    intro: {
      pretitle: "Because the future comes fast",
      title: "Elastic Byte Blog",
      content:
        "Future-forward perspectives on DevOps, Cloud Computing, and Infrastructure."
    },
    indexRoute: "/blog",
    postRoute: "/entry",
    limit: 2,
    returnLinkText: "Back",
    notFound: {
      title: "No Posts",
      subTitle: "Couldn't find any blog posts."
    },
    layout: {
      index: ["featuredImage", "tags", "headers", "meta"],
      single: ["tags", "headers", "authorDate", "featuredImage", "entry"],
      meta: ["authorDate", "tags"]
    },
    components: {
      blogWrap: (): Promise<Component> => import("./blog/blog-wrap.vue"),
      blogIndex: (): Promise<Component> => import("./blog/blog-index.vue"),
      blogSingle: (): Promise<Component> => import("./blog/blog-single.vue"),
      returnLink: (): Promise<Component> => import("./blog/el-return-link.vue"),
      excerpt: (): Promise<Component> => import("./blog/el-excerpt.vue"),
      featuredImage: (): Promise<Component> => import("./blog/el-featured-image.vue"),
      headers: (): Promise<Component> => import("./blog/el-headers.vue"),
      meta: (): Promise<Component> => import("./blog/el-meta.vue"),
      social: (): Promise<Component> => import("./blog/widget-social.vue")
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
        path: "/contact",
        name: "Contact"
      },
      {
        path: "/blog",
        name: "Blog"
      },
      {
        path: "https://twitter.com/",
        icon: "twitter",
        target: "_blank"
      }
    ],
    left: `Built with <i class="fa fa-heart"></i> in Nashville`,
    right:
      "<p>&copy; 2020 <a href='https://www.fiction.com/' target='_blank'>Fiction, Inc.</a></p>",
    figure: require("./img/cloud-with-shadow.svg"),
    figureAlt: "Cloud"
  }
}

export default {
  headTags: {
    font: `<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600&display=swap" rel="stylesheet" />`
  },
  site: {
    logo: () => import("./el/logo-zeno.vue"),
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
        path: "/#pricing",
        name: "Pricing"
      }
    ],
    cta: {
      title: "Get better results with Elastic Byte",
      buttons: [
        {
          link: "/contact",
          text: "Contact Us",
          classes: "bg-green-300 text-indigo-600"
        },
        {
          link: "/pricing",
          text: "Pricing",
          classes: "bg-gray-100 text-indigo-600"
        },
      ]
    },
  },
  home: {
    meta: {
      title: "Factor Zeno Theme",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions."
    },
    intro: {
      pretitle: "Grow Your Business, Not Infrastructure.",
      title: "We build, optimize, secure, and support your cloud with no long-term contract.",
      content: "Experts that architect and manage clouds with dedicated and obsessive 24/7/365 support.",
      buttons: [
        {
          link: "/contact",
          text: "Contact Us",
          classes: "bg-green-300 text-indigo-600"
        },
        {
          link: "/pricing",
          text: "Pricing",
          classes: "bg-gray-100 text-indigo-600"
        },
      ]
    },
    clients: {
      title: "Working with the following clouds:",
      list: [
        {
          link: "/",
          image: require("./img/aws.svg"),
          alt: "Amazon Web Services"
        },
        {
          link: "/",
          image: require("./img/google-cloud-platform.svg"),
          alt: "Google Cloud Platform"
        },
        {
          link: "/",
          image: require("./img/digital-ocean.svg"),
          alt: "Digital Ocean"
        }
      ]
    },
    solutions: {
      title: "Solutions",
      items: [
        {
          icon: require("./img/plan.svg"),
          title: "Plan",
          list: [
            {
              content: "Cloud infrastructure design that is secure, performant, elastic, affordable, and agnostic."
            },
            {
              content: "Migrate existing infrastructure from Heroku, on-premise, or other providers."
            },
            {
              content: "Re-architect your infrastructure or migrate to microservices, containers, and serverless."
            }
          ]
        },
        {
          icon: require("./img/build.svg"),
          title: "Build",
          list: [
            {
              content: "From simple LAMP/MEAN stacks to complex multi-region architectures using Packer, Terraform, containerization and beyond, we can build it."
            },
            {
              content: "CDN configuration and optimization including expert knowledge of CloudFlare."
            },
            {
              content: "Local development environments, continuous integration pipelines, deployments, and testing infrastructure."
            }
          ]
        },
        {
          icon: require("./img/manage.svg"),
          title: "Manage",
          list: [
            {
              content: "Manage your infrastructure spend and reduce costs."
            },
            {
              content: "Infrastructure monitoring and alerting using native cloud provider offerings or third parties such as Datadog, Pingdom, and PagerDuty."
            },
            {
              content: "Compliance and governance. Security patching and updating of infrastructure components."
            }
          ]
        }
      ]
    },
    devops: {
      pretitle: "Devops-as-a-Service",
      title: "Your first and last DevOps hire!",
      content: "<p>By leveraging our decades of DevOps and sysadmin experience, we'll help you focus on what's important… Growing your business.</p><p>Elastic Byte will handle uptime, security, cost optimization, disaster recovery, and performance. We’re always on-call, ready to assist. Focused on being responsive, transparent, and thorough.</p>",
      buttons: [
        {
          link: "/contact",
          text: "Contact Us",
          classes: "bg-green-300 text-indigo-600"
        }
      ],
      figure: () => import("./el/figure-devops.vue")
    },
    infrastructure: {
      pretitle: "Infrastructure as Code",
      title: "Packer + Terraform = ",
      titleIcon: require("./img/custom-heart.svg"),
      items: [
        {
          image: require("./img/logo-packer.svg"),
          alt: "HashiCorp Packer",
          content: "<p>Packer automates the creation of machine images across cloud providers.</p><p>It embraces modern configuration management by utilizing automated scripts to install and configure software within images.</p><p>Produces exact point-in-time images with multi-region replication support.</p>",
        },
        {
          image: require("./img/logo-terraform.svg"),
          alt: "HashiCorp Terraform",
          content: "<p>Terraform codifies infrastructure and resources, replacing manual point and click with a simple and intuitive declarative configuration.</p><p>Confidently apply reproducible infrastructure transformations. Humans make mistakes and forget details, machines and code don't.</p><p>Terraform configurations can be stored in version control, shared, and collaborated on by teams.</p>",
        }
      ],
      syntaxTitle: "terraform.tf",
      syntax: () => import("./el/figure-infrastructure.vue")
    },
    testimonials: {
      pretitle: "Success Stories",
      title: "Our customers love what we do!",
      items: [
        {
          content: "@elasticbyte architected and fully managed our migration to #kubernetes and on-premises enterprise deployments. They've been absolutely fantastic!",
          image: require("./img/client.svg"),
          author: "Will Norton",
          info: "CEO, SimplyAgree"
        },
        {
          content: "@elasticbyte architected and fully managed our migration to #kubernetes and on-premises enterprise deployments. They've been absolutely fantastic!",
          image: require("./img/client.svg"),
          author: "Will Norton",
          info: "CEO, SimplyAgree"
        }
      ]
    },
  },
  about: {
    meta: {
      title: "About - Factor Zeno Theme",
      description:
        "Elastic Byte is a DevOps as a service company which builds, optimizes, secures and supports your cloud."
    },
    intro: {
      pretitle: "About Us",
      title: "Elastic Byte is a DevOps as a service company which builds, optimizes, secures and supports your cloud.",
      image: require("./img/stars.svg"),
    },
    team: {
      title: "Leadership",
      members: [
        {
          photo: require("./img/justin.jpg"),
          social: [
            {
              link: "https://www.linkedin.com/in/jkell",
              icon: "linkedin"
            },
            {
              link: "https://github.com/nodesocket",
              icon: "github"
            },
            {
              link: "https://angel.co/justink",
              icon: "angellist"
            }
          ],
          title: "Founder",
          name: "Justin Keller",
          content: "Justin has been programming and managing infrastructure for over a decade and has founded three startups ranging from a hosting company to a Node.js platform as a service to a distributed SSH platform (Commando.io). He received his Bachelor of Science in Computer Science from San Diego State University. He's managed cloud infrastructure for Fortune 500 companies powered by Amazon Web Services and Google Cloud."
        }
      ]
    },
    location: {
      title: "Based in music city; Nashville, Tennessee.",
      figure: () => import("./el/figure-location.vue")
    }
  },
  footer: {
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
        path: "/#pricing",
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
        path: "https://twitter.com/",
        icon: "twitter"
      }
    ],
    left: `Built with <i class="fa fa-heart"></i> in Nashville`,
    right: "<p>&copy; 2020 <a href='https://nodesocket.com/' target='_blank'>NoseSocket, LLC.</a></p><p>All rights reserved.</p>",
  }
}

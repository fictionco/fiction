export default Factor => {
  return {
    headTags: {
      font: `<link href="https://fonts.googleapis.com/css?family=Poppins:400,700" rel="stylesheet" />`
    },
    site: {
      logo: () => import("./el/logo"),
      nav: [
        {
          path: "/",
          name: "Intro"
        },
        {
          path: "/about",
          name: "About"
        },
        {
          path: "/work",
          name: "Work"
        },
        {
          path: "/articles",
          name: "Blog"
        },
        {
          path: "/contact",
          name: "Contact"
        }
      ],
      social: [
        {
          path: "https://dribbble.com",
          icon: "dribbble"
        },
        {
          path: "https://behance.com/",
          icon: "behance"
        },
        {
          path: "https://instagram.com/",
          icon: "instagram"
        },
        {
          path: "https://twitter.com/",
          icon: "twitter"
        },
        {
          path: "https://linkedin.com/",
          icon: "linkedin"
        }
      ],
      clientsTitle: "Clients",
      clients: [
        {
          path: "https://www.behance.net/",
          icon: require("./img/client1.svg"),
          text: "Behance"
        },
        {
          path: "https://dribbble.com/",
          icon: require("./img/client2.svg"),
          text: "Dribbble"
        },
        {
          path: "https://www.tomposer.com/",
          icon: require("./img/client3.svg"),
          text: "Tom Poser"
        },
        {
          path: "https://twitter.com",
          icon: require("./img/client4.svg"),
          text: "Twitter"
        }
      ],
      cta: {
        headline: "For work inquiries, collaboration or feedback",
        path: "/contact",
        text: "Get in Touch"
      }
    },
    footer: {
      legal: "&copy; 2019 Factor Alpha Theme by Fiction Inc. All rights reserved.",
      nav: [
        {
          path: "/admin",
          text: "Sign In"
        },
        {
          path: "https://www.fiction.com/terms-of-service",
          text: "Terms of Service"
        },
        {
          path: "https://www.fiction.com/privacy-policy",
          text: "Privacy Policy"
        }
      ]
    },
    home: {
      meta: {
        title: "Factor Alpha Theme",
        description:
          "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions."
      },
      preheadline: "Alpha Theme",
      headline: "Hello, I’m Alpha. <br>A minimal, personal or portfolio theme.",
      subheadline:
        "Built with focus on a minimal and functional interface that delivers a bold visual experience.",
      actions: [
        {
          path: "/work",
          text: "View Work"
        }
      ],
      boxesTitle: "Check out the skills.",
      boxes: [
        {
          icon: require("./img/icon-ux.svg"),
          heading: "User Experience Design",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut"
        },
        {
          icon: require("./img/icon-ui.svg"),
          heading: "User Interface Design",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut"
        },
        {
          icon: require("./img/icon-web.svg"),
          heading: "Front-end Development",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut"
        },
        {
          icon: require("./img/icon-prototype.svg"),
          heading: "Prototyping",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut"
        }
      ]
    },
    about: {
      meta: {
        title: "Factor Alpha Theme",
        description:
          "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions."
      },
      headline: "About",
      subheadline: "Designer and Illustrator based in San Francisco.",
      content:
        "Adam is an award-winning designer and art director based in San Francisco. His work appears internationally in magazines, newspapers, advertisements and children's books.",
      heroImage: require("./img/about.jpg")
    },
    work: {
      headline: "Work",
      subheadline: "The simple way to showcase your work.",
      content:
        "Showcase your work in a breeze using modern technology. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
      heroImage: require("./img/work.jpg"),
      metatags: {
        title: "Work - Factor Alpha Theme",
        description:
          "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions."
      },
      indexRoute: "/work",
      postRoute: "/work",
      limit: 10,
      layout: {
        index: ["workFeaturedImage", "workEntry", "workTags"],
        single: ["workFeaturedImage", "workEntry"],
        meta: ["authorDate", "tags"]
      },
      components: {
        workWrap: () => import("./el/work-wrap.vue"),
        workIndex: () => import("./el/work-index.vue"),
        workFeaturedImage: () => import("./el/work-featured-image.vue"),
        workTags: () => import("./el/work-tags.vue"),
        workEntry: () => import("./el/work-entry.vue"),
        workSingle: () => import("./el/work-single.vue")
      },
      posts: {
        data: [
          {
            images: require("./img/project4.jpg"),
            title: "Richly Colored Building with a Beautiful Sky.",
            authorData: ["Alex Lanting"],
            content: "placeholder",
            id: "4",
            tags: ["Design", "Prototype", "Development"],
            path: "/"
          },
          {
            images: require("./img/project1.jpg"),
            title: "Shallow Focus of Hand with Red Paint",
            authorData: ["Ian Doodley"],
            content: "placeholder",
            id: "1",
            tags: ["Design", "Branding"],
            path: "/"
          }
          // {
          //   images: require("./img/project2.jpg"),
          //   title: "Yellow Coffee Cup",
          //   authorData: ["Marion Michelle"],
          //   content: "placeholder",
          //   id: "2",
          //   tags: ["Development"],
          //   path: "/"
          // }
          // {
          //   images: require("./img/project3.jpg"),
          //   title: "Low Angle of Yellow and Black Striped Building",
          //   authorData: ["Ronak Jain"],
          //   content: "placeholder",
          //   id: "3",
          //   tags: ["Prototype"],
          //   path: "/"
          // },
          // {
          //   images: require("./img/project4.jpg"),
          //   title: "Richly Colored Building with a Beautiful Sky.",
          //   authorData: ["Alex Lanting"],
          //   content: "placeholder",
          //   id: "4",
          //   tags: ["Design", "Prototype", "Development"],
          //   path: "/"
          // }
        ]
      }
    },
    blog: {
      indexRoute: "/articles",
      postRoute: "/articles",
      limit: 4,
      headline: "Blog",
      subheadline: "The Latest From Alpha",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
      heroImage: require("./img/blog.jpg"),
      metatags: {
        index: {
          title: "Blog - The Latest from Factor Alpha Theme",
          description:
            "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions."
        }
      },
      components: {
        blogFeaturedImage: () => import("./blog/featured-image.vue"),
        blogHeaders: () => import("./blog/headers.vue"),
        returnLink: () => import("./blog/return-link.vue"),
        blogExcerpt: () => import("./blog/excerpt.vue"),
        blogTags: () => import("./blog/tags.vue"),
        blogIndex: () => import("./blog/index.vue"),
        blogSingle: () => import("./blog/single.vue"),
        blogContent: () => import("./blog/wrap.vue")
      },
      layout: {
        index: ["blogFeaturedImage", "blogTags", "blogHeaders", "blogExcerpt"],
        single: [
          "returnLink",
          "blogHeaders",
          "blogTags",
          "blogFeaturedImage",
          "meta",
          "entry",
          "social",
          "authorBio"
        ],
        meta: ["authorDate"]
      }
    },
    contact: {
      metatags: {
        title: "Contact - Factor Alpha Theme",
        description:
          "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions."
      },
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
      }
    }
  }
}

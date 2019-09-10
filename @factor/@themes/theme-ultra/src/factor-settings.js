export default Factor => {
  return {
    headTags: {
      font: `<link href="https://fonts.googleapis.com/css?family=Work+Sans:400,600,700" rel="stylesheet" />`
    },
    site: {
      logo: () => import("./el/logo-ultra"),
      logoTitle: "Ultra Theme",
      nav: [
        {
          path: "#homeContainerID",
          name: "Home",
          target: "homeContainerID"
        },
        {
          path: "#aboutContainerID",
          name: "About",
          target: "aboutContainerID"
        },
        {
          path: "#servicesContainerID",
          name: "Services",
          target: "servicesContainerID"
        },
        {
          path: "#portfolioContainerID",
          name: "Portfolio",
          target: "portfolioContainerID"
        },
        {
          path: "#newsContainerID",
          name: "News"
        },
        {
          path: "#contactPageContainerID",
          name: "Contact"
        }
      ]
    },

    // sidebar: {
    //   sidebarOptions: [
    //     {
    //       text: "Home",
    //       path: "#homeContainerID",
    //       target: "homeContainerID"
    //     },
    //     {
    //       text: "About",
    //       path: "#aboutContainerID",
    //       target: "aboutContainerID"
    //     },
    //     {
    //       text: "Services",
    //       path: "#servicesContainerID",
    //       target: "servicesContainerID"
    //     },
    //     {
    //       text: "Portfolio",
    //       path: "#portfolioContainerID",
    //       target: "portfolioContainerID"
    //     },
    //     {
    //       text: "News",
    //       path: "#newsContainerID",
    //       target: "newsContainerID"
    //     },
    //     {
    //       text: "Contact",
    //       path: "#contactPageContainerID",
    //       target: "contactPageContainerID"
    //     }
    //   ]
    // },

    home: {
      pretitle: "Welcome To Ultra",
      title:
        "A modern one page theme for personal or portfolio exposure with unique effects and features.",
      actions: [
        {
          btn: "primary",
          path: "#servicesContainerID",
          text: "Start a Project",
          icon: "right-arrow"
        },
        {
          btn: "primary-ol",
          path: "#aboutContainerID",
          text: "More About Ultra",
          icon: "right-arrow"
        }
      ],
      meta: {
        title: "Ultra Theme - Built with Factor.js",
        description: "A simple portfolio theme for Factor.js framework."
      }
    },

    about: {
      pretitle: "About Me",
      title: "I am Ultra",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
      picture: require("./img/about.jpg"),
      counter: [
        {
          text: "Awards Received",
          number: "56"
        },
        {
          text: "Projects",
          number: "127"
        },
        {
          text: "Cups of Coffee",
          number: "876"
        },
        {
          text: "Happy Clients",
          number: "96"
        }
      ]
    },
    services: {
      pretitle: "What I Do",
      title: "Everything you need to launch and grow your business",
      items: [
        {
          title: "Illustration",
          text:
            "Nemo cupiditate ab quibusdam quaer impedit magni. Earum suscipit ipsum laudantium cupiditate.",
          icon: "illustration"
        },
        {
          title: "Branding",
          text:
            "Nemo cupiditate ab quibusdam quaer impedit magni. Earum suscipit ipsum laudantium cupiditate.",
          icon: "branding"
        },
        {
          title: "Marketing",
          text:
            "Nemo cupiditate ab quibusdam quaer impedit magni. Earum suscipit ipsum laudantium cupiditate.",
          icon: "marketing"
        },
        {
          title: "Web Development",
          text:
            "Nemo cupiditate ab quibusdam quaer impedit magni. Earum suscipit ipsum laudantium cupiditate.",
          icon: "webdev"
        }
      ]
    },
    portfolio: {
      pretitle: "Portfolio",
      title: "Check out some of the latest creative work.",
      pictures: [
        {
          picture: require("./img/portfolio01.jpg"),
          alt: "portfolio01",
          pictureClass: "pictureClasslong"
        },
        {
          picture: require("./img/portfolio06.jpg"),
          alt: "portfolio06",
          pictureClass: "pictureClasslong"
        },

        {
          picture: require("./img/portfolio02.jpg"),
          alt: "portfolio02",
          pictureClass: "pictureClasslong"
        },
        {
          picture: require("./img/portfolio03.jpg"),
          alt: "portfolio03",
          pictureClass: "pictureClasslong"
        },
        {
          picture: require("./img/portfolio04.jpg"),
          alt: "portfolio04",
          pictureClass: "pictureClasslong"
        },
        {
          picture: require("./img/portfolio05.jpg"),
          alt: "portfolio05",
          pictureClass: "pictureClasslong"
        }
      ],
      clientsTitle: "Previous Clients",
      clients: [
        {
          picture: require("./img/fiction.png"),
          alt: "fiction"
        },
        {
          picture: require("./img/fiction.png"),
          alt: "fiction"
        },
        {
          picture: require("./img/fiction.png"),
          alt: "fiction"
        },
        {
          picture: require("./img/fiction.png"),
          alt: "fiction"
        },
        {
          picture: require("./img/fiction.png"),
          alt: "fiction"
        },
        {
          picture: require("./img/fiction.png"),
          alt: "fiction"
        }
      ]
    },
    blog: {
      indexRoute: "/articles",
      postRoute: "/articles",
      limit: 4,
      returnLinkText: "All Articles",
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
        blogWrap: () => import("./blog/blog-wrap.vue"),
        blogIndex: () => import("./blog/blog-index.vue"),
        blogSingle: () => import("./blog/blog-single.vue"),
        blogFeaturedImage: () => import("./blog/el-featured-image.vue"),
        blogHeaders: () => import("./blog/el-headers.vue"),
        blogTags: () => import("./blog/el-tags.vue"),
        blogReturnLink: () => import("./blog/el-return-link.vue"),
        blogExcerpt: () => import("./blog/el-excerpt.vue")
      },
      layout: {
        index: ["blogFeaturedImage", "blogTags", "blogHeaders", "blogExcerpt"],
        single: [
          "blogReturnLink",
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
    news: {
      pretitle: "News",
      title: "Latest News",
      content: [
        {
          date: "July 6, 2020",
          title: "User Onboarding Done Right: Using The Power of Story.",
          content:
            "User onboarding is perhaps the most important piece of the entire customer conversion process.",
          action: {
            btn: "default",
            path: "/post-url-goes-here",
            text: "Read More..."
          }
        },
        {
          date: "July 6, 2020",
          title: "User Onboarding Done Right: Using The Power of Story.",
          content:
            "User onboarding is perhaps the most important piece of the entire customer conversion process.",
          action: {
            btn: "default",
            path: "/post-url-goes-here",
            text: "Read More..."
          }
        },
        {
          date: "July 6, 2020",
          title: "User Onboarding Done Right: Using The Power of Story.",
          content:
            "User onboarding is perhaps the most important piece of the entire customer conversion process.",
          action: {
            btn: "default",
            path: "/post-url-goes-here",
            text: "Read More..."
          }
        },
        {
          date: "July 6, 2020",
          title: "User Onboarding Done Right: Using The Power of Story.",
          content:
            "User onboarding is perhaps the most important piece of the entire customer conversion process.",
          action: {
            btn: "default",
            path: "/post-url-goes-here",
            text: "Read More..."
          }
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
            title: "Address",
            text: "123 Main St. Mountain View, Ca 94043"
          },
          {
            title: "Email me",
            text: "contact@fiction.com"
          },
          {
            title: "Call",
            text: "(+1)619-777-7777"
          }
        ]
      }
    }
  }
}

export default Factor => {
  return {
    headTags: {
      font: `<link href="https://fonts.googleapis.com/css?family=Work+Sans:400,600,700" rel="stylesheet" />`
    },
    docs: {
      pages: [],
      base: "docs"
    },
    site: {
      logo: () => import("./el/logo-ultra"),
      logoTitle: "Ultra Theme",
      nav: [
        {
          path: "#homeContainerID",
          name: "Home"
        },
        {
          path: "#aboutContainerID",
          name: "About"
        },
        {
          path: "#servicesContainerID",
          name: "Services"
        },
        {
          path: "#portfolioContainerID",
          name: "Portfolio"
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

    sidebar: {
      sidebarOptions: [
        {
          text: "Home",
          path: "#homeContainerID",
          target: "homeContainerID"
        },
        {
          text: "About",
          path: "#aboutContainerID",
          target: "aboutContainerID"
        },
        {
          text: "Services",
          path: "#servicesContainerID",
          target: "servicesContainerID"
        },
        {
          text: "Portfolio",
          path: "#portfolioContainerID",
          target: "portfolioContainerID"
        },
        {
          text: "News",
          path: "#newsContainerID",
          target: "newsContainerID"
        },
        {
          text: "Contact",
          path: "#contactPageContainerID",
          target: "contactPageContainerID"
        }
      ]
    },

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
        title: "Docs Theme - Factor.js",
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
      contentBlocks: [
        {
          title: "Illustration",
          text:
            "Nemo cupiditate ab quibusdam quaer impedit magni. Earum suscipit ipsum laudantium cupiditate.",
          icon: require("./img/square.svg"),
          alt: "square"
        },
        {
          title: "Branding",
          text:
            "Nemo cupiditate ab quibusdam quaer impedit magni. Earum suscipit ipsum laudantium cupiditate.",
          icon: require("./img/paint.svg"),
          alt: "paint"
        },
        {
          title: "Marketing",
          text:
            "Nemo cupiditate ab quibusdam quaer impedit magni. Earum suscipit ipsum laudantium cupiditate.",
          icon: require("./img/horn.svg"),
          alt: "horn"
        },
        {
          title: "Web Development",
          text:
            "Nemo cupiditate ab quibusdam quaer impedit magni. Earum suscipit ipsum laudantium cupiditate.",
          icon: require("./img/world.svg"),
          alt: "world"
        }
      ]
    },
    portfolio: {
      quote: "Portfolio",
      title: "Check out some of the latest creative works.",
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
      previousTitle: "Previous Clients",
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
    news: {
      quote: "News",
      title: "Latest News",
      content: [
        {
          date: "July 6, 2020",
          title:
            "User onboarding is perhaps the most important piece of the entire customer conversion process.",
          text:
            "User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.",
          fullContent:
            "User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.",
          contentClass: "firstNews",
          buttonText: "Read more...",
          closeButtonText: "Close"
        },
        {
          date: "July 6, 2020",
          title:
            "User onboarding is perhaps the most important piece of the entire customer conversion process.",
          text:
            "User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.",
          fullContent:
            "User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.",
          contentClass: "secondNews",
          buttonText: "Read more...",
          closeButtonText: "Close"
        },
        {
          date: "July 6, 2020",
          title:
            "User onboarding is perhaps the most important piece of the entire customer conversion process.",
          text:
            "User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.",
          fullContent:
            "User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.",
          contentClass: "thirdNews",
          buttonText: "Read more...",
          closeButtonText: "Close"
        },
        {
          date: "July 6, 2020",
          title:
            "User onboarding is perhaps the most important piece of the entire customer conversion process.",
          text:
            "User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.",
          fullContent:
            "User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.",
          contentClass: "quarteNews",
          buttonText: "Read more...",
          closeButtonText: "Close"
        },
        {
          date: "July 6, 2020",
          title:
            "User onboarding is perhaps the most important piece of the entire customer conversion process.",
          text:
            "User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.",
          fullContent:
            "User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.",
          contentClass: "fifthNews",
          buttonText: "Read more...",
          closeButtonText: "Close"
        },
        {
          date: "July 6, 2020",
          title:
            "User onboarding is perhaps the most important piece of the entire customer conversion process.",
          text:
            "User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.",
          fullContent:
            "User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.",
          contentClass: "sixthNews",
          buttonText: "Read more...",
          closeButtonText: "Close"
        }
      ]
    },
    contact: {
      quote: "Contact",
      title: "Reach out for a new project or just say hello",
      form: {
        title: "Send a message",
        placeholders: {
          name: "Your Name",
          email: "Your Email",
          text: "Your Message"
        },
        buttonText: "Submit"
      },
      info: {
        title: "Contact Info",
        contactInfo: [
          {
            title: "Address",
            text: "123 Main St. Mountain View, Ca 94043"
          },
          {
            title: "Email me",
            text: "contact@factor.com"
          },
          {
            title: "Call",
            text: "(+1) 619-777-7777"
          }
        ]
      }
    }
  }
}

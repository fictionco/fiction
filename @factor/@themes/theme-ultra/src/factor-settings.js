export default Factor => {
  return {
    docs: {
      pages: [],
      base: "docs"
    },

    sidebar: {
      sidebarHeadline: "Ultra.",
      sidebarOptions: [{
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
        },
      ],
    },

    home: {
      meta: {
        title: "Docs Theme - Factor.js",
        description: "A simple portfolio theme for Factor.js framework."
      },
      quotes: "Welcome To Ultra",
      mainQuotes: "A modern one page theme for personal or portfolio exposure with unique effects and features.",
      homeButtons: [{
          text: "Start a Project",
          class: 'home-button-start',
          icon: "right-arrow",
          path: "#servicesContainerID"
        },
        {
          text: "More About Ultra",
          class: 'home-button-more',
          icon: "right-arrow",
          path: "#aboutContainerID"
        },
      ]
    },

    about: {
      title: "About Me",
      contentTitle: "I am Ultra",
      aboutContentText: "Did shy say mention enabled through elderly improve. As at so believe account evening behaved hearted is. House is tiled we aware. It ye greatest removing concerns an overcame appetite. Manner result square father boy behind its his. Their above spoke match ye mr right oh as first. Be my depending to believing perfectly concealed household. Point could to built no hours smile sense.",
      picture: require("./img/about.jpg"),
      aboutData: [{
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
      quote: "What I Do",
      title: "Everythin you need to lunch and grow your business",
      contentBlocks: [{
          title: "Illustration",
          text: "As at so believe account evening behaved hearted is. House is tiled we aware. It ye greatest removing concerns an overcame appetite. Manner result square father boy behind its his. Their above spoke match ye mr right oh as first. Be my depending to believing perfectly concealed household.",
          icon: require("./img/square.svg"),
          alt: "square"
        },
        {
          title: "Branding",
          text: "As at so believe account evening behaved hearted is. House is tiled we aware. It ye greatest removing concerns an overcame appetite. Manner result square father boy behind its his. Their above spoke match ye mr right oh as first. Be my depending to believing perfectly concealed household.",
          icon: require("./img/paint.svg"),
          alt: "paint"
        },
        {
          title: "Marketing",
          text: "As at so believe account evening behaved hearted is. House is tiled we aware. It ye greatest removing concerns an overcame appetite. Manner result square father boy behind its his. Their above spoke match ye mr right oh as first. Be my depending to believing perfectly concealed household.",
          icon: require("./img/horn.svg"),
          alt: "horn"
        },
        {
          title: "Web Development",
          text: "As at so believe account evening behaved hearted is. House is tiled we aware. It ye greatest removing concerns an overcame appetite. Manner result square father boy behind its his. Their above spoke match ye mr right oh as first. Be my depending to believing perfectly concealed household.",
          icon: require("./img/world.svg"),
          alt: "world"
        },
      ]
    },
    portfolio: {
      quote: "Portfolio",
      title: "Check out some of the latest creative works.",
      pictures: [{
          picture: require("./img/portfolio01.jpg"),
          alt: "portfolio01",
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
        },
        {
          picture: require("./img/portfolio06.jpg"),
          alt: "portfolio06",
          pictureClass: "pictureClasslong"
        }
      ],
      previousTitle: "Previous Clients",
      clients: [{
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
      content: [{
          date: "July 6, 2020",
          title: "User onboarding is perhaps the most important piece of the entire customer conversion process.",
          text: "User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.",
          fullContent: "User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.",
          contentClass: "firstNews",
          buttonText: "Read more...",
          closeButtonText: "Close"
        },
        {
          date: "July 6, 2020",
          title: "User onboarding is perhaps the most important piece of the entire customer conversion process.",
          text: "User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.",
          fullContent: "User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.",
          contentClass: "secondNews",
          buttonText: "Read more...",
          closeButtonText: "Close"
        },
        {
          date: "July 6, 2020",
          title: "User onboarding is perhaps the most important piece of the entire customer conversion process.",
          text: "User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.",
          fullContent: "User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.",
          contentClass: "thirdNews",
          buttonText: "Read more...",
          closeButtonText: "Close"
        },
        {
          date: "July 6, 2020",
          title: "User onboarding is perhaps the most important piece of the entire customer conversion process.",
          text: "User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.",
          fullContent: "User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.",
          contentClass: "quarteNews",
          buttonText: "Read more...",
          closeButtonText: "Close"
        },
        {
          date: "July 6, 2020",
          title: "User onboarding is perhaps the most important piece of the entire customer conversion process.",
          text: "User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.",
          fullContent: "User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.",
          contentClass: "fifthNews",
          buttonText: "Read more...",
          closeButtonText: "Close"
        },
        {
          date: "July 6, 2020",
          title: "User onboarding is perhaps the most important piece of the entire customer conversion process.",
          text: "User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.",
          fullContent: "User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process. User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.User onboarding is perhaps the most important piece of the entire customer conversion process.",
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
        contactInfo: [{
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

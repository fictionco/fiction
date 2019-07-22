module.exports = Factor => {
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
          text: "Clients",
          path: "/clients"
        },
        {
          text: "News",
          path: "/news"
        },
        {
          text: "Contact",
          path: "/contact"
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
          class: 'homeButtonStart',
          icon: "right-arrow",
          path: "#servicesContainerID"
        },
        {
          text: "More About Ultra",
          class: 'homeButtonMore',
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
      ]
    }
  }
}

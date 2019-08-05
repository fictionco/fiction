export default Factor => {
  return {
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
      subheadline: "Built with focus on a minimal and functional interface that delivers a bold visual experience.",
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
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut"
        },
        {
          icon: require("./img/icon-ui.svg"),
          heading: "User Interface Design",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut"
        },
        {
          icon: require("./img/icon-web.svg"),
          heading: "Front-end Development",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut"
        },
        {
          icon: require("./img/icon-prototype.svg"),
          heading: "Prototyping",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut"
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
      meta: {
        title: "Work - Factor Alpha Theme",
        description:
          "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions."
      },
      headline: "Work",
      subheadline: "The simple way to showcase your work.",
      content:
        "Fully responsive and retina-display-ready. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
      heroImage: require("./img/work.jpg"),

      posts: {
        data: [
          {
            images: require("./img/project1.jpg"),
            title: "Shallow Focus of Hand with Red Paint",
            authorData: ["Ian Doodley"],
            content: "placeholder",
            id: "1",
            tags: ["Design", "Branding"],
            path: "/"
          },
          {
            images: require("./img/project2.jpg"),
            title: "Yellow Coffee Cup",
            authorData: ["Marion Michelle"],
            content: "placeholder",
            id: "2",
            tags: ["Development"],
            path: "/"
          },
          {
            images: require("./img/project3.jpg"),
            title: "Low Angle of Yellow and Black Striped Building",
            authorData: ["Ronak Jain"],
            content: "placeholder",
            id: "3",
            tags: ["Prototype"],
            path: "/"
          },
          {
            images: require("./img/project4.jpg"),
            title: "Richly Colored Building with a Beautiful Sky.",
            authorData: ["Alex Lanting"],
            content: "placeholder",
            id: "4",
            tags: ["Design", "Prototype", "Development"],
            path: "/"
          }
        ]
      }
    },
    blog: {
      meta: {
        title: "Blog - Factor Alpha Theme",
        description:
          "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions."
      },
      headline: "Blog",
      subheadline: "The Latest From Alpha",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
      heroImage: require("./img/blog.jpg"),
      posts: {
        data: [
          {
            format: "listing",
            title: "7 Awesome Udemy Courses for App Development",
            content: "Udemy offers a wide range of courses covering a variety of topics...",
            date: "April 11, 2020",
            id: "1",
            tags: ["Development"],
            path: "/",
            authorData: [
              {
                uid: 1,
                displayName: "Raymond Aleman"
              }
            ]
          },
          {
            format: "listing",
            title: "Something else about Factor and its benefits",
            content: "Two Udemy offers a wide range of courses covering a variety of topics...",
            date: "April 25, 2020",
            id: "1",
            tags: ["Design"],
            path: "/",
            authorData: [
              {
                uid: 22,
                displayName: "Andrew Powers"
              }
            ]
          },
          {
            format: "listing",
            title: "7 Awesome Udemy Courses for App Development",
            content: "Udemy offers a wide range of courses covering a variety of topics...",
            date: "May 12, 2020",
            id: "1",
            tags: ["Development"],
            path: "/",
            authorData: [
              {
                uid: 22,
                displayName: "Andrew Powers"
              }
            ]
          }
        ]
      }
    },
    contact: {
      meta: {
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

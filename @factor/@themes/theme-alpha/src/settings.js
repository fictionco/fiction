module.exports = Factor => {
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
          icon: "client1.svg",
          text: "Behance"
        },
        {
          path: "https://dribbble.com/",
          icon: "client2.svg",
          text: "Dribbble"
        },
        {
          path: "https://www.tomposer.com/",
          icon: "client3.svg",
          text: "Tom Poser"
        },
        {
          path: "https://twitter.com",
          icon: "client4.svg",
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
          icon: "icon-ux.svg",
          heading: "User Experience Design",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut"
        },
        {
          icon: "icon-ui.svg",
          heading: "User Interface Design",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut"
        },
        {
          icon: "icon-web.svg",
          heading: "Front-end Development",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut"
        },
        {
          icon: "icon-prototype.svg",
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
      heroImage: "about.jpg"
    },
    contact: {
      meta: {
        title: "Factor Alpha Theme",
        description:
          "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions."
      },
      headline: "Contact",
      subheadline: "Let's Talk!",
      content:
        "Drop me a note and I’ll get back to you within 24 hours. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
      heroImage: "contact.jpg",
      form: {
        NamePlaceholder: "name asdf",
        buttonText: "Contact"
      }
    },
    posts: {
      data: [
        {
          images: "test.jpg",
          title: "A Project",
          authorData: ["Ray", "Andrew"],
          content: "erer",
          id: 1,
          tags: ["Design", "Prototype", "Development"],
          path: "/"
        },
        {
          images: "test.jpg",
          title: "A Project",
          authorData: [{ 1: "Ray" }, { 2: "Andrew" }],
          content: "erer",
          id: 2,
          tags: ["Design", "Prototype", "Development"],
          path: "/"
        },
        {
          images: "test.jpg",
          title: "A Project",
          authorData: [{ 1: "Ray" }, { 2: "Andrew" }],
          content: "erer",
          id: 3,
          tags: ["Design", "Prototype", "Development"],
          path: "/"
        },
        {
          images: "test.jpg",
          title: "A Project",
          authorData: [{ 1: "Ray" }, { 2: "Andrew" }],
          content: "erer",
          id: 3,
          tags: ["Design", "Prototype", "Development"],
          path: "/"
        }
      ]
    }
  }
}

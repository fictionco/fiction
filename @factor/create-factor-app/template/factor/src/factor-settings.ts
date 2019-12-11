export default {
  home: {
    meta: {
      title: "<%= name %>",
      description: "<%= description %>",
      image: require("./static/factor-logo.jpg")
    },
    image: require("./img/factor-logo.svg"),
    title: "<%= name %>",
    subtitle: "<%= description %>",
    actions: [
      {
        link: "https://factor.dev/guide",
        target: "_blank",
        text: "Documentation",
        style: "primary"
      },
      {
        link: "https://github.com/fiction-com/factor",
        target: "_blank",
        text: "Github",
        style: "default"
      }
    ]
  }
}

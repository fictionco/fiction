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
  },
  footer: {
    headline: "Released under the GPL-2 License",
    legal: "Copyright &copy; - <a href='https://www.fiction.com'>Fiction.com</a>",
    logo: () => import("./el/logo-fiction.vue")
  },
  home: {
    clients: [
      {
        link: "/",
        image:  require("./img/aws.svg"),
        alt: "Amazon Web Services"
      },
      {
        link: "/",
        image:  require("./img/aws.svg"),
        alt: "Amazon Web Services"
      },
      {
        link: "/",
        image:  require("./img/aws.svg"),
        alt: "Amazon Web Services"
      }
    ],
    meta: {
      title: "Factor Zeno Theme",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions."
    }
  }
}

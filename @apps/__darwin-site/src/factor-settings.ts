export default {
  app: { url: "https://darwin.dev" },
  site: {
    logo: (): Promise<any> => import("./el/brand.vue"),
  },
  emailList: {
    darwinAlpha: {
      tags: ["darwin-alpha"],
      form: {
        buttonText: "Get early access &rarr;",
        placeholder: "Your email",
      },
    },
  },
  footer: {
    legal:
      "&copy; 2020 <a href='https://www.fiction.com'>Fiction.com</a> Inc.",
  },
}

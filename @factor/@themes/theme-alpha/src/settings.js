module.exports = Factor => {
  return {
    site: {
      logo: () => import("./logo")
    },
    about: {
      headline: "hmm",
      subheadline: "another one",
      content: "how about some content &copy;",
      heroImage: "test.jpg"
    }
  }
}

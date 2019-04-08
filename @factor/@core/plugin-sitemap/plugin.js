export default Factor => {
  return new class {
    constructor() {
      Factor.$filters.add("middleware", _ => {
        _.push({
          path: "/sitemap.xml",
          callback: (req, res) => {
            console.log("SITEMAPXML")
            res.status(200).send("Sitemap XML Can Go Here... make cached")
          }
        })

        return _
      })
    }
  }()
}

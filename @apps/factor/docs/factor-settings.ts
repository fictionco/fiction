export default {
  docsEngine: {
    nav: [
      {
        items: [
          {
            title: "Docs Home",
            path: "/docs",
            icon: "far fa-file-alt"
          }
        ]
      },
      {
        title: "Get Started",
        items: [
          {
            doc: "introduction",
            title: "Introduction",
            path: "/docs/introduction",
            file: (): Promise<string> => import("./introduction.md")
          },
          { title: "Core Concepts", path: "/docs/core-concepts" }
        ]
      },
      {
        title: "Creating Apps",
        items: [
          { title: "test", path: "/docs" },
          { title: "Yes, I AM", path: "/" }
        ]
      },
      {
        title: "Advanced / Extensions",
        items: [
          { title: "test", path: "/docs" },
          { title: "Another Item for This", path: "/" }
        ]
      },
      {
        title: "Tutorials / Examples",
        items: [{ title: "test", path: "/" }]
      }
    ]
  }
}

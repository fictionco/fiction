export default [
  {
    items: [
      {
        title: "Docs Home",
        path: "/docs",
        icon: "far fa-file-alt",
      },
    ],
  },
  {
    title: "Getting Started",
    description: "Learn how to setup your Factor app",
    boxIcon: "quick",
    items: [
      {
        doc: "introduction",
        file: (): Promise<string> => import("./getting-started/introduction/index.md"),
      },
    ],
  },
]

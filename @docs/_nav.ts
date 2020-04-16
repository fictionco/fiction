export default [
  {
    items: [
      {
        title: "Docs Home",
        path: "/docs",
        icon: "far fa-file-alt",
      },
      {
        doc: "introduction",
        file: (): Promise<string> => import("./getting-started/introduction/index.md"),
      },
      {
        doc: "core-concepts",
        file: (): Promise<string> => import("./getting-started/core-concepts/index.md"),
      },
    ],
  },
  {
    title: "Essentials",
    description: "Learn how to setup your Factor app",
    boxIcon: "quick",
    items: [
      {
        doc: "install",
        file: (): Promise<string> => import("./essentials/install/index.md"),
      },
    ],
  },
]

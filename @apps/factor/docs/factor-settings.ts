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
            file: (): Promise<string> => import("./introduction.md")
          },
          {
            doc: "quickstart",
            file: (): Promise<string> => import("./quickstart.md")
          },
          {
            doc: "dashboard-setup",
            file: (): Promise<string> => import("./dashboard-setup.md")
          }
        ]
      },
      {
        title: "Creating Apps",
        items: [
          {
            doc: "structure",
            file: (): Promise<string> => import("./structure.md")
          },
          {
            doc: "settings-and-style",
            file: (): Promise<string> => import("./settings-and-style.md")
          },
          {
            doc: "posts-and-pages",
            file: (): Promise<string> => import("./posts-and-pages.md")
          },
          {
            title: "Using the CLI",
            doc: "cli",
            file: (): Promise<string> => import("./cli.md")
          },
          {
            doc: "router-and-store",
            file: (): Promise<string> => import("./router-and-store.md")
          },
          {
            title: "Meta Info",
            doc: "metainfo",
            file: (): Promise<string> => import("./metainfo.md")
          },

          {
            doc: "plugins-and-themes",
            file: (): Promise<string> => import("./plugins-and-themes.md")
          },
          {
            doc: "deployment",
            file: (): Promise<string> => import("./deployment.md")
          }
        ]
      },
      {
        title: "Advanced / Extensions",
        items: [
          {
            doc: "working-with-posts",
            file: (): Promise<string> => import("./working-with-posts.md")
          },
          {
            doc: "endpoints-and-middleware",
            file: (): Promise<string> => import("./endpoints-and-middleware.md")
          },
          {
            doc: "ssr",
            title: "Server-Side Rendering",
            file: (): Promise<string> => import("./ssr.md")
          },

          {
            doc: "creating-plugins",
            file: (): Promise<string> => import("./creating-plugins.md")
          },
          {
            doc: "creating-themes",
            file: (): Promise<string> => import("./creating-themes.md")
          },
          {
            doc: "filters-callbacks-events",
            title: "Filters, Callbacks and Events",
            file: (): Promise<string> => import("./filters-callbacks-events.md")
          },
          {
            doc: "extend-the-dashboard",
            file: (): Promise<string> => import("./extend-the-dashboard.md")
          },
          {
            doc: "extend-the-cli",
            title: "Extend the CLI",
            file: (): Promise<string> => import("./extend-the-cli.md")
          }
        ]
      },
      {
        title: "Tutorials / Examples",
        items: [
          {
            doc: "basic-example",
            file: (): Promise<string> => import("./basic-example.md")
          }
        ]
      },
      {
        title: "Contributing",
        items: [
          {
            doc: "contribution",
            file: (): Promise<string> => import("./contribution.md")
          }
        ]
      }
    ]
  }
}

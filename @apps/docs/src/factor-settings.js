import { isLoggedIn } from "@factor/user"
import { accountMenu } from "@factor/dashboard"

export default {
  app: {
    url: "https://factor.dev"
  },
  metaInfo: {
    default: {
      image: require("./static/factor-logo.jpg")
    }
  },
  emailList: {
    alphaProgram: {
      tags: ["factor-dev"]
    }
  },
  docs: {
    base: "guide",
    pages: [
      {
        group: "Getting Started"
      },
      {
        doc: "",
        name: "Introduction",
        file: () => import("../docs/intro.md"),
        title: "Introduction: Why Use Factor"
      },
      {
        doc: "framework-comparison",
        name: "Compare",
        file: () => import("../docs/compare.md"),
        title: "Comparing Web App Frameworks"
      },
      {
        doc: "quickstart",
        title: "Installation and Quickstart",
        description:
          "Quick start guide on how to install Factor framework and Vue CMS in less than 5 minutes.",
        file: () => import("../docs/quickstart.md")
      },
      {
        doc: "dashboard-setup",
        file: () => import("../docs/dashboard/setup.md"),
        title: "Setting Up the Dashboard and CMS"
      },

      {
        group: "App Development"
      },
      {
        name: "File Structure",
        doc: "file-structure",
        file: () => import("../docs/structure.md"),
        title: "Factor File Structure"
      },
      {
        name: "Add Extensions",
        doc: "extension-basics",
        file: () => import("../docs/extension-basics.md"),
        title: "Using Plugins / Themes"
      },

      {
        doc: "customize",
        file: () => import("../docs/customize.md"),
        title: "Customize Factor Plugins and Themes"
      },

      {
        doc: "config",
        name: "Config",
        file: () => import("../docs/config.md"),
        title: "Factor Config and Setup CLI"
      },
      {
        doc: "pages",
        file: () => import("../docs/pages.md"),
        title: "Pages and Page Templates"
      },
      {
        doc: "cli",
        name: "Use the CLI",
        file: () => import("../docs/cli.md"),
        title: "Using Factor CLI and Creating Custom Commands"
      },
      {
        doc: "filters",
        file: () => import("../docs/framework/filters.md"),
        title: "Factor Filters and Callbacks API"
      },
      {
        doc: "routes-and-stores",
        file: () => import("../docs/framework/routes-stores.md"),
        title: "Configuring Routes and Stores"
      },
      {
        doc: "meta",
        file: () => import("../docs/meta.md"),
        title: "Setting Meta and Metatags"
      },

      {
        name: "Server and Endpoints",
        doc: "server",
        file: () => import("../docs/server.md"),
        title: "Using Server Side Rendering (SSR)"
      },

      {
        name: "Hosting Your App",
        doc: "serving",
        file: () => import("../docs/hosting.md"),
        title: "Hosting and Serving Your Factor App"
      },

      {
        group: "Extension Development"
      },

      {
        doc: "create-plugins",
        file: () => import("../docs/creating-plugins.md"),
        title: "Using and Creating Factor Themes"
      },
      {
        doc: "create-themes",
        file: () => import("../docs/creating-themes.md"),
        title: "Using and Creating Factor Themes"
      },
      {
        name: "Working With Posts",
        doc: "post-system",
        file: () => import("../docs/posts.md"),
        title: "Working with Posts"
      },
      {
        name: "Extend The Dashboard",
        doc: "extend-dashboard",
        file: () => import("../docs/dashboard.md"),
        title: "Extending the Factor Dashboard"
      },
      {
        name: "Extend the CLI",
        doc: "extend-the-CLI",
        file: () => import("../docs/cli-dev.md"),
        title: "Extending the Factor CLI"
      },

      {
        group: "Contributing"
      },
      {
        name: "Contribution Guidelines",
        doc: "contribution",
        file: () => import("../docs/contribution.md"),
        title: "Contributing Guidelines"
      },

      {
        name: "Philosophy and Style",
        doc: "philosophy",
        file: () => import("../docs/philosophy.md"),
        title: "Factor Philosophy"
      },
      {
        group: "Reference"
      },
      {
        doc: "filter-reference",
        file: () => import("../docs/filter-reference.md"),
        title: "Factor Filters Reference"
      }
    ]
  },
  site: {
    logo: () => import("../src/el/logo-factor.vue"),
    nav: [
      {
        path: "/guide",
        name: "Development Guide"
      },
      {
        path: "/themes",
        name: "Themes"
      },
      {
        path: "/plugins",
        name: "Plugins"
      },

      {
        path: "https://github.com/fiction-com/factor",
        name: "Github",
        icon: "github",
        target: "_blank"
      },
      {
        event: "sign-in-modal",
        name: "Sign In &rarr;",
        condition: () => !isLoggedIn()
      },
      {
        component: accountMenu,
        condition: () => isLoggedIn()
      }
    ]
  },
  plugins: {
    cta: {
      title: "Create and Submit Your Plugin",
      subtitle:
        "Learn about extension development and how to submit your extension to the Factor library."
    }
  },

  footer: {
    headline: "Released under the GPL-2 License",
    legal: "Copyright &copy; - <a href='https://www.fiction.com'>Fiction.com</a>",
    logo: () => import("../src/el/logo-fiction.vue"),
    logo2: () => import("../src/el/logo-pagelines.vue")
  }
}

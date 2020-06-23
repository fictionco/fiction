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
        file: (): Promise<string> => import("./overview/introduction/index.md"),
      },
      {
        doc: "core-concepts",
        file: (): Promise<string> => import("./overview/core-concepts/index.md"),
      },
    ],
  },

  {
    title: "Get Started",
    description: "Up and running in 10 minutes.",
    boxIcon: "quick",
    items: [
      {
        title: "QuickStart Videos",
        doc: "quickstart",
        file: (): Promise<string> => import("./get-started/quickstart/index.md"),
      },
      {
        title: "Create a Factor App",
        doc: "create-factor-app",
        file: (): Promise<string> => import("./get-started/create-factor-app/index.md"),
      },
      {
        title: "Manual Install",
        doc: "manual-install",
        file: (): Promise<string> => import("./get-started/manual-install/index.md"),
      },
      {
        title: "Services Setup",
        doc: "services-setup",
        file: (): Promise<string> => import("./get-started/services-setup/index.md"),
      },
    ],
  },

  {
    title: "Essentials",
    description: "Essential development tools and techniques",
    boxIcon: "touch",
    items: [
      {
        doc: "upgrading",
        file: (): Promise<string> => import("./essentials/upgrading/index.md"),
      },
      {
        doc: "before-you-start",
        file: (): Promise<string> => import("./essentials/before-you-code/index.md"),
      },
      {
        title: "Running Factor (CLI)",
        doc: "cli",
        file: (): Promise<string> => import("./essentials/cli/index.md"),
      },
      {
        title: "Basic Configuration",
        doc: "configuration",
        file: (): Promise<string> => import("./essentials/configuration/index.md"),
      },
      {
        doc: "using-plugins",
        file: (): Promise<string> => import("./essentials/using-plugins/index.md"),
      },
      {
        doc: "using-themes",
        file: (): Promise<string> => import("./essentials/using-themes/index.md"),
      },
      {
        doc: "file-structure",
        file: (): Promise<string> => import("./essentials/file-structure/index.md"),
      },
      {
        doc: "settings",
        file: (): Promise<string> => import("./essentials/settings/index.md"),
      },
      {
        title: "Styles &amp; CSS Variables",
        doc: "styles",
        file: (): Promise<string> => import("./essentials/styles/index.md"),
      },
      {
        title: "Private Keys (.env)",
        doc: "dotenv",
        file: (): Promise<string> => import("./essentials/dotenv/index.md"),
      },

      {
        doc: "main-files",
        file: (): Promise<string> => import("./essentials/main-files/index.md"),
      },

      {
        title: "Meta Info",
        doc: "metainfo",
        file: (): Promise<string> => import("./essentials/metainfo/index.md"),
      },

      {
        title: "Content Wrapper",
        doc: "content",
        file: (): Promise<string> => import("./essentials/content/index.md"),
      },

      {
        title: "Users &amp; Roles",
        doc: "users-and-roles",
        file: (): Promise<string> => import("./essentials/users-and-roles/index.md"),
      },

      {
        title: "Routes and Views",
        doc: "routes",
        file: (): Promise<string> => import("./essentials/routes/index.md"),
      },
      {
        title: "Using Standard UI",
        doc: "using-standard-ui",
        file: (): Promise<string> => import("./essentials/using-standard-ui/index.md"),
      },
      {
        doc: "static-assets",
        file: (): Promise<string> => import("./essentials/static-assets/index.md"),
      },
      {
        title: "TypeScript",
        doc: "typescript",
        file: (): Promise<string> => import("./essentials/typescript/index.md"),
      },
      {
        doc: "localization",
        file: (): Promise<string> => import("./essentials/localization/index.md"),
      },
      {
        title: "Deployment &amp; Hosting",
        doc: "deployment-and-hosting",
        file: (): Promise<string> => import("./essentials/deployment/index.md"),
      },
    ],
  },
  {
    title: "Advanced",
    description: "Building advanced apps and extensions",
    boxIcon: "settings",
    items: [
      {
        title: "Filters, Callbacks, Events",
        doc: "filters-callbacks-events",
        file: (): Promise<string> =>
          import("./advanced/filters-callbacks-events/index.md"),
      },

      {
        doc: "database",
        file: (): Promise<string> => import("./advanced/database/index.md"),
      },
      {
        doc: "working-with-data",
        file: (): Promise<string> => import("./advanced/working-with-data/index.md"),
      },
      {
        doc: "authentication",
        file: (): Promise<string> => import("./advanced/authentication/index.md"),
      },
      {
        doc: "working-with-posts",
        file: (): Promise<string> => import("./advanced/working-with-posts/index.md"),
      },
      {
        doc: "post-types",
        file: (): Promise<string> => import("./advanced/post-types/index.md"),
      },
      {
        doc: "embedded-posts",
        file: (): Promise<string> => import("./advanced/embedded-posts/index.md"),
      },
      {
        doc: "links",
        file: (): Promise<string> => import("./advanced/links/index.md"),
      },
      {
        doc: "page-templates",
        file: (): Promise<string> => import("./advanced/page-templates/index.md"),
      },
      {
        doc: "endpoints-and-middleware",
        file: (): Promise<string> =>
          import("./advanced/endpoints-and-middleware/index.md"),
      },
      {
        doc: "transactional-email",
        file: (): Promise<string> => import("./advanced/transactional-email/index.md"),
      },
      {
        title: "Extend the CLI",
        doc: "extend-the-cli",
        file: (): Promise<string> => import("./advanced/extend-the-cli/index.md"),
      },
      {
        doc: "markdown",
        file: (): Promise<string> => import("./advanced/markdown/index.md"),
      },
      {
        doc: "extending-webpack",
        file: (): Promise<string> => import("./advanced/extending-webpack/index.md"),
      },
      {
        doc: "creating-plugins",
        file: (): Promise<string> => import("./advanced/creating-plugins/index.md"),
      },
      {
        doc: "theme-development",
        file: (): Promise<string> => import("./advanced/theme-development/index.md"),
      },
    ],
  },
  {
    title: "API",
    description: "Reference the Factor APIs",
    boxIcon: "doc",
    items: [
      {
        title: "CSS Variables",
        doc: "css-variables",
        file: (): Promise<string> => import("./api/css-variables/index.md"),
      },
      {
        title: "Standard UI",
        doc: "standard-ui",
        file: (): Promise<string> => import("./api/standard-ui/index.md"),
      },
      {
        title: "Form UI",
        doc: "form-ui",
        file: (): Promise<string> => import("./api/form-ui/index.md"),
      },
      {
        doc: "template-settings",
        file: (): Promise<string> => import("./api/template-settings/index.md"),
      },
      {
        doc: "extension-guidelines",
        file: (): Promise<string> => import("./api/extension-guidelines/index.md"),
      },
    ],
  },
  {
    title: "Examples",
    boxIcon: "example",
    description: "Example projects to help get you started",
    items: [
      {
        doc: "hacker-news",
        file: (): Promise<string> => import("./examples/hacker-news/index.md"),
      },
      {
        doc: "development-monorepo",
        file: (): Promise<string> => import("./examples/development-monorepo/index.md"),
      },
      {
        doc: "custom-blog",
        file: (): Promise<string> => import("./examples/custom-blog/index.md"),
      },
    ],
  },
  {
    title: "Integrations",
    description: "Using popular tools and services with Factor",
    boxIcon: "plugin",
    items: [
      {
        doc: "mongo-atlas",
        file: (): Promise<string> => import("./integrations/mongo-atlas/index.md"),
      },
      {
        doc: "mongo-local",
        file: (): Promise<string> => import("./integrations/mongo-local/index.md"),
      },
      {
        doc: "amazon-s3",
        file: (): Promise<string> => import("./integrations/amazon-s3/index.md"),
      },
      {
        doc: "mailgun",
        file: (): Promise<string> => import("./integrations/mailgun/index.md"),
      },
      {
        doc: "heroku",
        file: (): Promise<string> => import("./integrations/heroku/index.md"),
      },
      {
        title: "Pro / Business Suite",
        doc: "pro-suite",
        file: (): Promise<string> => import("./integrations/pro-suite/index.md"),
      },
    ],
  },
]

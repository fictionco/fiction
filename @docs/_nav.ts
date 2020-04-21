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
    title: "Essentials",
    description: "Essential development tools and techniques",
    boxIcon: "quick",
    items: [
      {
        title: "Installation",
        doc: "install",
        file: (): Promise<string> => import("./essentials/install/index.md"),
      },
      {
        doc: "upgrading",
        file: (): Promise<string> => import("./essentials/upgrading/index.md"),
      },
      {
        doc: "before-you-start",
        file: (): Promise<string> => import("./essentials/before-you-start/index.md"),
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
        title: "Deployment &amp; Hosting",
        doc: "deployment-and-hosting",
        file: (): Promise<string> => import("./essentials/deployment/index.md"),
      },
    ],
  },
  {
    title: "Advanced",
    description: "Building advanced apps and extensions",
    items: [
      {
        doc: "working-with-data",
        file: (): Promise<string> => import("./advanced/working-with-data/index.md"),
      },
      {
        doc: "authentication",
        file: (): Promise<string> => import("./advanced/authentication/index.md"),
      },
      {
        doc: "links",
        file: (): Promise<string> => import("./advanced/links/index.md"),
      },
    ],
  },
  {
    title: "API",
    description: "Reference the Factor APIs",
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
    ],
  },
  {
    title: "Examples",
    description: "Example projects to help get you started",
    items: [
      {
        doc: "hacker-news",
        file: (): Promise<string> => import("./examples/hacker-news/index.md"),
      },
    ],
  },
  {
    title: "Integrations",
    description: "Using popular tools and services with Factor",
    boxIcon: "quick",
    items: [
      {
        doc: "mongo-atlas",
        file: (): Promise<string> => import("./integrations/mongo-atlas/index.md"),
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
    ],
  },
]

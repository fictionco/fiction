import { MarkdownFile } from "@factor/types"
export default [
  {
    items: [
      {
        title: "Docs Home",
        path: "/docs",
        //icon: "svg icon",
      },
      {
        docName: "introduction",
        file: (): Promise<MarkdownFile> =>
          import("./overview/introduction/index.md"),
      },
      {
        docName: "core-concepts",
        file: (): Promise<MarkdownFile> =>
          import("./overview/core-concepts/index.md"),
      },
    ],
  },

  {
    title: "Get Started",
    description: "Up and running in 10 minutes.",
    boxIcon: `<svg class="h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2.02c-5.51 0-9.98 4.47-9.98 9.98s4.47 9.98 9.98 9.98 9.98-4.47 9.98-9.98S17.51 2.02 12 2.02zm0 17.96c-4.4 0-7.98-3.58-7.98-7.98S7.6 4.02 12 4.02 19.98 7.6 19.98 12 16.4 19.98 12 19.98zM12.75 5l-4.5 8.5h3.14V19l4.36-8.5h-3z" fill="currentColor"></path></svg>`,
    items: [
      {
        title: "QuickStart Videos",
        docName: "quickstart",
        file: (): Promise<any> => import("./get-started/quickstart/index.md"),
      },
      {
        title: "Create a Factor App",
        docName: "create-factor-app",
        file: (): Promise<any> =>
          import("./get-started/create-factor-app/index.md"),
      },
      {
        title: "Manual Install",
        docName: "manual-install",
        file: (): Promise<any> =>
          import("./get-started/manual-install/index.md"),
      },
      {
        title: "Services Setup",
        docName: "services-setup",
        file: (): Promise<any> =>
          import("./get-started/services-setup/index.md"),
      },
    ],
  },

  {
    title: "Essentials",
    description: "Essential development tools and techniques",
    boxIcon: `<svg class="h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.19,12.44l-3.24-1.62c1.29-1,2.12-2.56,2.12-4.32c0-3.03-2.47-5.5-5.5-5.5s-5.5,2.47-5.5,5.5c0,2.13,1.22,3.98,3,4.89 v3.26c-2.15-0.46-2.02-0.44-2.26-0.44c-0.53,0-1.03,0.21-1.41,0.59L4,16.22l5.09,5.09C9.52,21.75,10.12,22,10.74,22h6.3 c0.98,0,1.81-0.7,1.97-1.67l0.8-4.71C20.03,14.32,19.38,13.04,18.19,12.44z M17.84,15.29L17.04,20h-6.3 c-0.09,0-0.17-0.04-0.24-0.1l-3.68-3.68l4.25,0.89V6.5c0-0.28,0.22-0.5,0.5-0.5c0.28,0,0.5,0.22,0.5,0.5v6h1.76l3.46,1.73 C17.69,14.43,17.91,14.86,17.84,15.29z M8.07,6.5c0-1.93,1.57-3.5,3.5-3.5s3.5,1.57,3.5,3.5c0,0.95-0.38,1.81-1,2.44V6.5 c0-1.38-1.12-2.5-2.5-2.5c-1.38,0-2.5,1.12-2.5,2.5v2.44C8.45,8.31,8.07,7.45,8.07,6.5z" fill="currentColor"></path></svg>`,
    items: [
      {
        docName: "upgrading",
        file: (): Promise<any> => import("./essentials/upgrading/index.md"),
      },
      {
        docName: "before-you-start",
        file: (): Promise<any> =>
          import("./essentials/before-you-code/index.md"),
      },
      {
        title: "Running Factor (CLI)",
        docName: "cli",
        file: (): Promise<any> => import("./essentials/cli/index.md"),
      },
      {
        title: "Basic Configuration",
        docName: "configuration",
        file: (): Promise<any> => import("./essentials/configuration/index.md"),
      },
      {
        docName: "using-plugins",
        file: (): Promise<any> => import("./essentials/using-plugins/index.md"),
      },
      {
        docName: "using-themes",
        file: (): Promise<any> => import("./essentials/using-themes/index.md"),
      },
      {
        docName: "file-structure",
        file: (): Promise<any> =>
          import("./essentials/file-structure/index.md"),
      },
      {
        docName: "settings",
        file: (): Promise<any> => import("./essentials/settings/index.md"),
      },
      {
        title: "Styles &amp; CSS Variables",
        docName: "styles",
        file: (): Promise<any> => import("./essentials/styles/index.md"),
      },
      {
        title: "Private Keys (.env)",
        docName: "dotenv",
        file: (): Promise<any> => import("./essentials/dotenv/index.md"),
      },

      {
        docName: "main-files",
        file: (): Promise<any> => import("./essentials/main-files/index.md"),
      },

      {
        title: "Meta Info",
        docName: "metainfo",
        file: (): Promise<any> => import("./essentials/metainfo/index.md"),
      },

      {
        title: "Content Wrapper",
        docName: "content",
        file: (): Promise<any> => import("./essentials/content/index.md"),
      },

      {
        title: "Users &amp; Roles",
        docName: "users-and-roles",
        file: (): Promise<any> =>
          import("./essentials/users-and-roles/index.md"),
      },

      {
        title: "Routes and Views",
        docName: "routes",
        file: (): Promise<any> => import("./essentials/routes/index.md"),
      },
      {
        title: "Using Standard UI",
        docName: "using-standard-ui",
        file: (): Promise<any> =>
          import("./essentials/using-standard-ui/index.md"),
      },
      {
        docName: "static-assets",
        file: (): Promise<any> => import("./essentials/static-assets/index.md"),
      },
      {
        title: "TypeScript",
        docName: "typescript",
        file: (): Promise<any> => import("./essentials/typescript/index.md"),
      },
      {
        docName: "localization",
        file: (): Promise<any> => import("./essentials/localization/index.md"),
      },
      {
        title: "Deployment &amp; Hosting",
        docName: "deployment-and-hosting",
        file: (): Promise<any> => import("./essentials/deployment/index.md"),
      },
    ],
  },
  {
    title: "Advanced",
    description: "Building advanced apps and extensions",
    boxIcon: `<svg class="h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46a.5.5 0 00-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.488.488 0 0014 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1a.566.566 0 00-.18-.03c-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46a.5.5 0 00.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.06.02.12.03.18.03.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-1.98-1.71c.04.31.05.52.05.73 0 .21-.02.43-.05.73l-.14 1.13.89.7 1.08.84-.7 1.21-1.27-.51-1.04-.42-.9.68c-.43.32-.84.56-1.25.73l-1.06.43-.16 1.13-.2 1.35h-1.4l-.19-1.35-.16-1.13-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7-1.06.43-1.27.51-.7-1.21 1.08-.84.89-.7-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13-.89-.7-1.08-.84.7-1.21 1.27.51 1.04.42.9-.68c.43-.32.84-.56 1.25-.73l1.06-.43.16-1.13.2-1.35h1.39l.19 1.35.16 1.13 1.06.43c.43.18.83.41 1.23.71l.91.7 1.06-.43 1.27-.51.7 1.21-1.07.85-.89.7.14 1.13zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="currentColor"/></svg>`,
    items: [
      {
        title: "Filters, Callbacks, Events",
        docName: "filters-callbacks-events",
        file: (): Promise<any> =>
          import("./advanced/filters-callbacks-events/index.md"),
      },

      {
        docName: "database",
        file: (): Promise<any> => import("./advanced/database/index.md"),
      },
      {
        docName: "working-with-data",
        file: (): Promise<any> =>
          import("./advanced/working-with-data/index.md"),
      },
      {
        docName: "authentication",
        file: (): Promise<any> => import("./advanced/authentication/index.md"),
      },
      {
        docName: "working-with-posts",
        file: (): Promise<any> =>
          import("./advanced/working-with-posts/index.md"),
      },
      {
        docName: "post-types",
        file: (): Promise<any> => import("./advanced/post-types/index.md"),
      },
      {
        docName: "embedded-posts",
        file: (): Promise<any> => import("./advanced/embedded-posts/index.md"),
      },
      {
        docName: "links",
        file: (): Promise<any> => import("./advanced/links/index.md"),
      },
      {
        docName: "page-templates",
        file: (): Promise<any> => import("./advanced/page-templates/index.md"),
      },
      {
        docName: "endpoints-and-middleware",
        file: (): Promise<any> =>
          import("./advanced/endpoints-and-middleware/index.md"),
      },
      {
        docName: "transactional-email",
        file: (): Promise<any> =>
          import("./advanced/transactional-email/index.md"),
      },
      {
        title: "Extend the CLI",
        docName: "extend-the-cli",
        file: (): Promise<any> => import("./advanced/extend-the-cli/index.md"),
      },
      {
        docName: "markdown",
        file: (): Promise<any> => import("./advanced/markdown/index.md"),
      },
      {
        docName: "extending-webpack",
        file: (): Promise<any> =>
          import("./advanced/extending-webpack/index.md"),
      },
      {
        docName: "creating-plugins",
        file: (): Promise<any> =>
          import("./advanced/creating-plugins/index.md"),
      },
      {
        docName: "theme-development",
        file: (): Promise<any> =>
          import("./advanced/theme-development/index.md"),
      },
    ],
  },
  // {
  //   title: "API",
  //   description: "Reference the Factor APIs",
  //   boxIcon: `<svg class="h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" fill="currentColor"/></svg>`,
  //   items: [
  //     {
  //       title: "CSS Variables",
  //       docName: "css-variables",
  //       file: (): Promise<any> => import("./api/css-variables/index.md"),
  //     },
  //     {
  //       title: "Standard UI",
  //       docName: "standard-ui",
  //       file: (): Promise<any> => import("./api/standard-ui/index.md"),
  //     },
  //     {
  //       title: "Form UI",
  //       docName: "form-ui",
  //       file: (): Promise<any> => import("./api/form-ui/index.md"),
  //     },
  //     {
  //       docName: "template-settings",
  //       file: (): Promise<any> => import("./api/template-settings/index.md"),
  //     },
  //     {
  //       docName: "extension-guidelines",
  //       file: (): Promise<any> => import("./api/extension-guidelines/index.md"),
  //     },
  //   ],
  // },
  {
    title: "Examples",
    boxIcon: `<svg class="h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3.55 19.09l1.41 1.41 1.79-1.8-1.41-1.41zM11 20h2v3h-2zM1 11h3v2H1zm12-6.95v3.96l1 .58c1.24.72 2 2.04 2 3.46 0 2.21-1.79 4-4 4s-4-1.79-4-4c0-1.42.77-2.74 2-3.46l1-.58V4.05h2m2-2H9v4.81C7.21 7.9 6 9.83 6 12.05c0 3.31 2.69 6 6 6s6-2.69 6-6c0-2.22-1.21-4.15-3-5.19V2.05zM20 11h3v2h-3zm-2.76 7.71l1.79 1.8 1.41-1.41-1.8-1.79z" fill="currentColor"/></svg>`,
    description: "Example projects to help get you started",
    items: [
      {
        docName: "hacker-news",
        file: (): Promise<any> => import("./examples/hacker-news/index.md"),
      },
      {
        docName: "development-monorepo",
        file: (): Promise<any> =>
          import("./examples/development-monorepo/index.md"),
      },
      {
        docName: "custom-blog",
        file: (): Promise<any> => import("./examples/custom-blog/index.md"),
      },
    ],
  },
  {
    title: "Integrations",
    description: "Using popular tools and services with Factor",
    boxIcon: `<svg class="h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" class="docs-figure-icon group-icon primary" viewBox="0 0 24 24"><path d="M16 9v4.66l-3.5 3.51V19h-1v-1.83L8 13.65V9h8m0-6h-2v4h-4V3H8v4h-.01C6.9 6.99 6 7.89 6 8.98v5.52L9.5 18v3h5v-3l3.5-3.51V9c0-1.1-.9-2-2-2V3z" fill="currentColor"/></svg>`,
    items: [
      {
        docName: "mongo-atlas",
        file: (): Promise<any> => import("./integrations/mongo-atlas/index.md"),
      },
      {
        docName: "mongo-local",
        file: (): Promise<any> => import("./integrations/mongo-local/index.md"),
      },
      {
        docName: "amazon-s3",
        file: (): Promise<any> => import("./integrations/amazon-s3/index.md"),
      },
      {
        docName: "mailgun",
        file: (): Promise<any> => import("./integrations/mailgun/index.md"),
      },
      {
        docName: "heroku",
        file: (): Promise<any> => import("./integrations/heroku/index.md"),
      },
      {
        title: "Pro / Business Suite",
        docName: "pro-suite",
        file: (): Promise<any> => import("./integrations/pro-suite/index.md"),
      },
    ],
  },
]

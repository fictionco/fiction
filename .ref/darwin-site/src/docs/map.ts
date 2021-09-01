import { MarkdownFile } from "@factor/types"
import { DocGroupRecord, mapTypeHelper } from "@factor/plugin-docs-engine"

import * as installationGuidesMap from "./get-started/installGuides/map"
import { group as devGroup, docs as devDocs } from "./developer/map"

export const docs = mapTypeHelper({
  install: {
    fileImport: (): Promise<MarkdownFile> =>
      import("./get-started/install/install.md"),
  },

  installationGuides: {
    fileImport: (): Promise<MarkdownFile> =>
      import("./get-started/installGuides/index.md"),
  },
  eventsGoals: {
    title: "Goals and Events",
    fileImport: (): Promise<MarkdownFile> =>
      import("./analytics/eventsGoals/index.md"),
  },
  siteSettings: {
    title: "Site Settings",
    fileImport: (): Promise<MarkdownFile> =>
      import("./analytics/siteSettings/index.md"),
  },
  analyticsOverview: {
    title: "Analytics Overview",
    fileImport: (): Promise<MarkdownFile> =>
      import("./analytics/overview/index.md"),
  },

  dashboard: {
    title: "The Dashboard",
    fileImport: (): Promise<MarkdownFile> =>
      import("./analytics/dashboard/index.md"),
  },
  trafficReports: {
    title: "Traffic and Reports",
    fileImport: (): Promise<MarkdownFile> =>
      import("./analytics/trafficReports/index.md"),
  },
  heatmaps: {
    title: "Heatmaps",
    fileImport: (): Promise<MarkdownFile> =>
      import("./analytics/heatmaps/index.md"),
  },
  abAnalytics: {
    title: "AB Analytics / Experiments",
    fileImport: (): Promise<MarkdownFile> =>
      import("./analytics/experiments/index.md"),
  },
  sessionReplay: {
    title: "Session Replay",
    fileImport: (): Promise<MarkdownFile> =>
      import("./analytics/sessionReplay/index.md"),
  },
  behaviorTracking: {
    title: "Interactions and Behavior",
    fileImport: (): Promise<MarkdownFile> =>
      import("./analytics/behaviorTracking/index.md"),
  },
  performanceDebugging: {
    title: "Monitor and Debug",
    fileImport: (): Promise<MarkdownFile> =>
      import("./analytics/performanceDebugging/index.md"),
  },
  privacy: {
    title: "Your Privacy and Darwin",
    fileImport: (): Promise<any> => import("./legal/your-privacy/index.md"),
  },
  tos: {
    title: "Terms of Service",
    fileImport: (): Promise<any> => import("./legal/terms/index.md"),
  },
  privacyPolicy: {
    title: "Privacy Policy",
    fileImport: (): Promise<any> => import("./legal/privacy/index.md"),
  },
  gdpr: {
    title: "GDPR Commitment",
    fileImport: (): Promise<any> => import("./legal/gdpr/index.md"),
  },
  ccpa: {
    title: "CCPA Commitment",
    fileImport: (): Promise<any> => import("./legal/ccpa/index.md"),
  },
  affiliateTerms: {
    title: "Affiliate Terms",
    fileImport: (): Promise<any> => import("./legal/affiliate/index.md"),
  },
  ...installationGuidesMap.map,
  ...devDocs,
})

export const groups: DocGroupRecord<keyof typeof docs> = {
  docs: {
    title: "Docs Home",
    description: `Explore everything you can do with Darwin.`,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>`,
    path: "/docs",
  },
  getStarted: {
    title: "Get Started",
    description: `Learn how to install the tracking script and get Darwin set up in your project.`,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>`,
    path: "/docs/install",
    menu: ["install", "installationGuides"],
  },
  settingUp: {
    title: "Setting Up",
    path: "/docs/events-goals",
    description: `How to set up Darwin to take advantage of custom goals, conversion events and enhanced tracking settings.`,
    icon: `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>`,
    menu: ["eventsGoals", "siteSettings"],
  },
  analytics: {
    title: "Analytics Tools",
    path: "/docs/analytics-overview",
    description: `Learn how to use and work with Darwin's web analytics including heatmaps, replays and more.`,
    icon: `<svg xmlns="http://www.w3.org/2000/svg"   fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>`,
    menu: [
      "analyticsOverview",
      "dashboard",
      "trafficReports",
      "heatmaps",
      "abAnalytics",
      "sessionReplay",
      "behaviorTracking",
      "performanceDebugging",
    ],
  },
  ...devGroup,
  legal: {
    title: "Privacy and Legal",
    path: "/docs/privacy",
    description:
      "Understand Darwin's approach to privacy, security, and compliance.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>`,
    menu: ["privacy", "tos", "privacyPolicy", "gdpr", "ccpa", "affiliateTerms"],
  },
}

// export const map: DocsMap = {
//   docs: {
//     title: "Docs Home",
//     description: `Explore everything you can do with Darwin.`,
//     path: "/docs",
//     icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//   </svg>`,
//   },

//   getStarted: {
//     title: "Get Started",
//     docId: "install",
//     description: `Learn how to install the tracking script and get Darwin set up in your project.`,
//     icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
//   </svg>`,
//     pages: {
//       install: {
//         title: "Basic Darwin Installation",
//         file: (): Promise<MarkdownFile> =>
//           import("./get-started/install/install.md"),
//       },

//       installationGuides: {
//         title: "Installation Guides",
//         file: (): Promise<MarkdownFile> =>
//           import("./get-started/installGuides/index.md"),
//       },
//       ...installationGuidesMap.map,
//     },
//   },
//   settingUp: {
//     title: "Setting Up",
//     docId: "eventsGoals",
//     description: `How to set up Darwin to take advantage of custom goals, conversion events and enhanced tracking settings.`,
//     icon: `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
//   </svg>`,
//     pages: {
//       eventsGoals: {
//         title: "Goals and Events",
//         file: (): Promise<MarkdownFile> =>
//           import("./analytics/eventsGoals/index.md"),
//       },
//       siteSettings: {
//         title: "Site Settings",
//         file: (): Promise<MarkdownFile> =>
//           import("./analytics/siteSettings/index.md"),
//       },
//     },
//   },
//   analytics: {
//     title: "Analytics Tools",
//     docId: "analyticsOverview",
//     description: `Learn how to use and work with Darwin's web analytics including heatmaps, replays and more.`,
//     icon: `<svg xmlns="http://www.w3.org/2000/svg"   fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//   </svg>`,
//     pages: {
//       analyticsOverview: {
//         title: "Analytics Overview",
//         file: (): Promise<MarkdownFile> =>
//           import("./analytics/overview/index.md"),
//       },

//       dashboard: {
//         title: "The Dashboard",
//         file: (): Promise<MarkdownFile> =>
//           import("./analytics/dashboard/index.md"),
//       },
//       trafficReports: {
//         title: "Traffic and Reports",
//         file: (): Promise<MarkdownFile> =>
//           import("./analytics/trafficReports/index.md"),
//       },
//       heatmaps: {
//         title: "Heatmaps",
//         file: (): Promise<MarkdownFile> =>
//           import("./analytics/heatmaps/index.md"),
//       },
//       abAnalytics: {
//         title: "AB Analytics / Experiments",
//         file: (): Promise<MarkdownFile> =>
//           import("./analytics/experiments/index.md"),
//       },
//       sessionReplay: {
//         title: "Session Replay",
//         file: (): Promise<MarkdownFile> =>
//           import("./analytics/sessionReplay/index.md"),
//       },
//       behaviorTracking: {
//         title: "Interactions and Behavior",
//         file: (): Promise<MarkdownFile> =>
//           import("./analytics/behaviorTracking/index.md"),
//       },
//       performanceDebugging: {
//         title: "Monitor and Debug",
//         file: (): Promise<MarkdownFile> =>
//           import("./analytics/performanceDebugging/index.md"),
//       },
//     },
//   },
//   ...devMap,

//   legal: {
//     title: "Privacy and Legal",
//     docId: "privacy",
//     description:
//       "Understand Darwin's approach to privacy, security, and compliance.",
//     icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
//   </svg>`,
//     pages: {
//       privacy: {
//         title: "Your Privacy and Darwin",
//         file: (): Promise<any> => import("./legal/your-privacy/index.md"),
//       },
//       tos: {
//         title: "Terms of Service",
//         file: (): Promise<any> => import("./legal/terms/index.md"),
//       },
//       privacyPolicy: {
//         title: "Privacy Policy",
//         file: (): Promise<any> => import("./legal/privacy/index.md"),
//       },
//       gdpr: {
//         title: "GDPR Commitment",
//         file: (): Promise<any> => import("./legal/gdpr/index.md"),
//       },
//       ccpa: {
//         title: "CCPA Commitment",
//         file: (): Promise<any> => import("./legal/ccpa/index.md"),
//       },
//       affiliateTerms: {
//         title: "Affiliate Terms",
//         file: (): Promise<any> => import("./legal/affiliate/index.md"),
//       },
//     },
//   },
// }

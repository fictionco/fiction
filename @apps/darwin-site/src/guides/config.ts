import { MarkdownFile } from "@factor/types"
export const guideConfig = [
  {
    title: "Heatmaps Guide",
    name: "Heatmaps",
    guide: "heatmaps",
    file: (): Promise<MarkdownFile> => import("./heatmaps/heatmaps.md"),
    children: [
      {
        name: "Heatmap benefits",
        guide: "benefits",
        file: (): Promise<MarkdownFile> => import("./heatmaps/benefits.md"),
      },
      {
        name: "Start using heatmaps",
        guide: "start-using-heatmaps",
        file: (): Promise<MarkdownFile> => import("./heatmaps/start.md"),
      },
      {
        name: "Analyze a heatmap",
        guide: "analysis",
        file: (): Promise<MarkdownFile> => import("./heatmaps/analysis.md"),
      },
      {
        name: "Advanced heatmap insights",
        guide: "advanced",
        file: (): Promise<MarkdownFile> => import("./heatmaps/advanced.md"),
      },
      {
        name: "Heatmap infographic",
        guide: "infographic",
        file: (): Promise<MarkdownFile> => import("./heatmaps/infographic.md"),
      },
      // {
      //   name: "Heatmaps software",
      //   guide: "/heatmaps",
      // },
    ],
  },
  {
    title: "User Experience Guide",
    name: "User experience",
    guide: "user-experience",
    file: (): Promise<MarkdownFile> =>
      import("./user-experience/user-experience.md"),
    children: [
      {
        name: "Effective research",
        guide: "research",
        file: (): Promise<MarkdownFile> =>
          import("./user-experience/research.md"),
      },
      {
        name: "Design process",
        guide: "process",
        file: (): Promise<MarkdownFile> =>
          import("./user-experience/design-process.md"),
      },
      {
        name: "Best practices",
        guide: "best-practices",
        file: (): Promise<MarkdownFile> =>
          import("./user-experience/best-practices.md"),
      },
    ],
  },
  {
    title: "Session Replay guide",
    name: "Session replay",
    guide: "session-replays",
    file: (): Promise<MarkdownFile> =>
      import("./session-replays/session-replays.md"),
    children: [
      {
        name: "Start using session replays",
        guide: "start-using-session-replays",
        file: (): Promise<MarkdownFile> => import("./session-replays/start.md"),
      },
      {
        name: "Advanced",
        guide: "advanced",
        file: (): Promise<MarkdownFile> =>
          import("./session-replays/advanced.md"),
      },
      // {
      //   name: "Session replay software",
      //   guide: "/session-replay",
      // },
    ],
  },
  {
    title: "Usability testing",
    name: "Usability testing",
    guide: "usability-testing",
    file: (): Promise<MarkdownFile> =>
      import("./usability-testing/usability-testing.md"),
    children: [
      {
        name: "Usability testing methods",
        guide: "methods",
        file: (): Promise<MarkdownFile> =>
          import("./usability-testing/methods.md"),
      },
      {
        name: "Usability testing questions",
        guide: "questions",
        file: (): Promise<MarkdownFile> =>
          import("./usability-testing/questions.md"),
      },
      {
        name: "Analyze results",
        guide: "analyze-results",
        file: (): Promise<MarkdownFile> =>
          import("./usability-testing/analyze.md"),
      },
    ],
  },
  {
    title: "Conversion Rate Optimization Guide",
    name: "User-centric CRO",
    guide: "conversion-rate-optimization",
    file: (): Promise<MarkdownFile> => import("./cro/cro.md"),
    children: [
      {
        name: "3-Step CRO plan",
        guide: "3-step-cro-plan",
        file: (): Promise<MarkdownFile> => import("./cro/cro-plan.md"),
      },
    ],
  },

  {
    title: "User Journey Guide",
    name: "User journey",
    guide: "user-journey",
    file: (): Promise<MarkdownFile> => import("./user-journey/user-journey.md"),
    children: [
      {
        name: "Build user journey map",
        guide: "build-journey-map",
        file: (): Promise<MarkdownFile> => import("./user-journey/build.md"),
      },
    ],
  },
  {
    title: "Website Analysis",
    name: "Website analysis",
    guide: "website-analysis",
    file: (): Promise<MarkdownFile> =>
      import("./website-analysis/website-analysis.md"),
    children: [
      {
        name: "User driven analysis",
        guide: "user-driven-analysis",
        file: (): Promise<MarkdownFile> =>
          import("./website-analysis/user-driven-analysis.md"),
      },
      {
        name: "Analysis checklist",
        guide: "analysis-checklist",
        file: (): Promise<MarkdownFile> =>
          import("./website-analysis/checklist.md"),
      },
    ],
  },
  {
    title: "Website Redesign",
    name: "Website redesign guide",
    guide: "website-redesign",
    file: (): Promise<MarkdownFile> =>
      import("./website-redesign/website-redesign.md"),
    children: [
      {
        name: "Redesign research process",
        guide: "research-process",
        file: (): Promise<MarkdownFile> =>
          import("./website-redesign/research-process.md"),
      },
      {
        name: "Website redesign tips",
        guide: "tips",
        file: (): Promise<MarkdownFile> => import("./website-redesign/tips.md"),
      },
    ],
  },
]

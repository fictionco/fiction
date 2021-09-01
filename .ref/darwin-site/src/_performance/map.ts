import screenPerformance from "./img/screenPerformance.webp"
import thumbDebugging from "./img/thumbDebugging.webp"
import { defineAsyncComponent as def } from "vue"
import { mapTypeHelper } from "../util"

export const map = mapTypeHelper({
  performance: {
    class: "text-green-500",
    bgClass: "bg-green-50",
    path: "/features/performance",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>`,
    name: "Debugging",
    tagline: "Detect errors and slowdowns",
    screenshot: screenPerformance,
    thumb: thumbDebugging,
    description:
      "Darwin triggers events on errors and tracks your website vitals over time",
    aspects: [
      {
        align: "wide",
        tagline: "Debugging Made Simple",
        name: "Debugging is a headache without visualization.",
        description: `JavaScript errors can be hard to reproduce, as often they are specific to an environment. Use Darwin to isolate identify where errors are happening and their root cause.`,

        figure: def(() => import("./FigureErrors.vue")),
      },
      {
        align: "wide",
        tagline: "Page Vitals",
        name: "Measure Vitals and Network Performance",
        description: `Page performance is important for SEO. Use Darwin to monitor which requests are slow across the spectrum of your visitors and then take action.`,
        figure: def(() => import("./FigurePerformance.vue")),
      },
    ],
  },
})

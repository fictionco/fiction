import behaviorScreenshot from "./img/screenBehavior.webp"
import thumbBehavior from "./img/thumbBehavior.webp"
import { defineAsyncComponent as def } from "vue"
import { mapTypeHelper } from "../util"

export const map = mapTypeHelper({
  behavior: {
    class: "text-green-500",
    bgClass: "text-green-50",
    path: "/features/behavior",
    icon: `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
  </svg>`,
    name: "Behavioral Analytics",
    tagline: "Track every interaction",
    screenshot: behaviorScreenshot,
    thumb: thumbBehavior,
    description:
      "Use behavioral data, like scrolls and clicks, to enhance traditional metrics like bounce rate and time on site.",
    aspects: [
      {
        align: "wide",
        tagline: "High Resolution Analytics",
        name: "Understand what performs and what doesn't..",
        description: `Traditional metrics, like bounce rate, don't give you the full story.
          Darwin tracks and aggregates every interaction on your site to help you see what creates engagement and leads to conversion.`,
        figure: def(() => import("./FigureBehavior.vue")),
      },
      {
        align: "wide",
        tagline: "Depth of Engagement",
        name: "See how visitors are engaging.",
        description: `Use metrics like scroll depth or touches per page to see if users are really reading your material. As you optimize, see the results improve over time.`,
        figure: def(() => import("./FigureEngage.vue")),
      },
    ],
  },
})

import screenDash from "./img/screenDashboards.webp"
import thumbDash from "./img/thumbDashboards.webp"

import { defineAsyncComponent as def } from "vue"
import { mapTypeHelper } from "../util"

export const map = mapTypeHelper({
  dashboards: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
</svg>`,
    class: "text-blue-600",
    bgClass: "bg-blue-100",
    path: "/features/dashboards",
    name: "Smart Dashboards",
    tagline: "Deep-dive into metrics",
    description:
      "Easily make complex data comparisons, view trends, measure goals, rapidly improve and iterate.",
    screenshot: screenDash,
    thumb: thumbDash,
    align: "right",
    aspects: [
      {
        align: "wide",
        tagline: "Custom dashboards made easy.",
        name: "Your data just got more interesting.",
        description: `Create the dashboards that you always dreamed of. Darwin gives you full control of what data is important to you.`,
        figure: def(() => import("./FigureChart.vue")),
      },
      {
        align: "wide",
        tagline: "Powerful Widgets",
        name: `Widgets for Everything,<br/> and more...`,
        description: `No more scouring for information. Use Darwin widgets to customize which information is useful to you.`,
        figure: def(() => import("./FigureWidgets.vue")),
      },
    ],
  },
})

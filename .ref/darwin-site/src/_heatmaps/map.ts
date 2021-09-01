import heatmapsScreenshot from "./img/screenHeatmaps.webp"
import thumbHeatmaps from "./img/thumbHeatmaps.webp"
import { defineAsyncComponent as def } from "vue"
import { mapTypeHelper } from "../util"

export const map = mapTypeHelper({
  heatmaps: {
    class: "text-red-500",
    bgClass: "text-red-50",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
</svg>`,
    path: "/features/heatmaps",
    name: "Live Heatmaps",
    tagline: "Visualize user behavior",
    description:
      "Free heatmap analytics to view your user engagement with each element on your site and how it affects their behavior.",
    screenshot: heatmapsScreenshot,
    thumb: thumbHeatmaps,
    aspects: [
      {
        align: "wide",
        tagline: "On-Demand Live Heatmaps",

        name: `Data meets context.`,
        description: `Bring together the qualitative and quantitative. Use heatmaps to add context and meaning to your data.`,
        figure: def(() => import("./FigureHeatmap.vue")),
      },
      {
        align: "wide",
        tagline: "Filter and Control Heatmap Data",
        name: "Custom Heatmaps in Realtime",
        description: `Use analytics filters, date controls and other tools to visualize how different segments of traffic behave over time.`,
        figure: def(() => import("./FigureHeatmapRealtime.vue")),
      },
    ],
  },
})

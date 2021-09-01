import screenRealtime from "./img/screenRealtime.webp"
import thumbRealtime from "./img/thumbRealtime.webp"
import { defineAsyncComponent as def } from "vue"
import { mapTypeHelper } from "../util"

export const map = mapTypeHelper({
  realtime: {
    class: "text-orange-500",
    bgClass: "text-orange-50",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
</svg>`,
    path: "/features/realtime",
    name: "Real-time Data",
    tagline: "Learn faster, move faster.",
    description:
      "Proactively monitor your user experience, find issues before they cost you revenue and improve fast.",
    screenshot: screenRealtime,
    thumb: thumbRealtime,
    aspects: [
      {
        align: "wide",
        tagline: "Smart performance monitoring",
        name: "Watch your performance, as it happens...",
        description: `Create smart realtime dashboards to use in the office or to see the results of marketing efforts.`,
        figure: def(() => import("./FigureRealtimePerformance.vue")),
      },
      {
        align: "wide",
        tagline: "Fix problems fast",
        name: "Smart Verification and Monitoring",
        description: `Sure everything is working correctly? Use custom realtime dashboards to watch exactly the metrics important to you, in real time.`,
        figure: def(() => import("./FigureRealtimeMonitoring.vue")),
      },
    ],
  },
})

//import replayIndexScreenshot from "./img/dashboardReplayIndex.webp"
import replayScreenshot from "./img/dashboardReplay.webp"
import thumbReplay from "./img/thumbReplay.webp"
import { defineAsyncComponent as def } from "vue"
import { mapTypeHelper } from "../util"

export const map = mapTypeHelper({
  replay: {
    class: "text-orange-500",
    bgClass: "text-orange-50",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>`,
    path: "/features/replay",
    name: "Session Replay",
    tagline: "See what your users see",
    description:
      "See where users get stuck, increase conversion rates, and debug your product faster with smart metadata.",
    //screenshot: replayIndexScreenshot,
    screenshot: replayScreenshot,
    thumb: thumbReplay,
    aspects: [
      {
        align: "wide",
        tagline: "Qualitative Analytics",
        name: "Qualitative Meets Quantitative",
        description: `Darwin combines detailed data analytics along with qualitative tools to give you the best of both worlds.`,
        figure: def(() => import("./FigureReplay.vue")),
      },
      {
        align: "wide",
        tagline: "Qualitative Analytics",
        name: "The Science of Empathy",
        description: `Your visitors experience your site with new eyes. Watch session replays to visualize how they absorb your content, where they get stuck, and thus where you can improve...`,
        figure: def(() => import("./FigureReplayMouse.vue")),
      },
      {
        align: "wide",
        tagline: "Powerful Data At Your Fingertips",
        name: "Focus Your (Recording) Efforts",
        description: `With Darwin, you only record the sessions that you feel are interesting to your business. For example, record when a conversion happens or if a user hits an error.`,
        figure: def(() => import("./FigureReplaySettings.vue")),
      },
    ],
  },
})

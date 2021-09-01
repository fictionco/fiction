import variantsScreenshot from "./img/screenVariants.webp"
import thumbVariants from "./img/thumb-variants.webp"
import { defineAsyncComponent as def } from "vue"
import { mapTypeHelper } from "../util"

export const map = mapTypeHelper({
  ab: {
    class: "text-blue-600",
    bgClass: "bg-blue-100",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
</svg>`,
    path: "/features/ab",
    name: "AB Analytics",
    tagline: "Comparative testing",
    description:
      "Quickly create tests that show what text creates the best results.",
    screenshot: variantsScreenshot,
    thumb: thumbVariants,
    aspects: [
      {
        align: "wide",
        tagline: "Create and test site variants",
        name: "Ever wonder which headline works the best?",
        description: `The variant builder allows you to easily edit your website and test different versions of your site`,
        figure: def(() => import("./FigureABConversion.vue")),
      },
      {
        align: "wide",
        tagline: "Light-weight testing and results",
        name: "AB Testing without the overhead.",
        description: `Unlike other ab testing tools, Darwin is designed for simplicity. Setup experiments in minutes without developer help.`,
        figure: def(() => import("./FigureABVariant.vue")),
      },
      {
        align: "wide",
        tagline: "Experiment Targeting",
        name: "Segment and Target",
        description: `Sometimes it's useful to know how different segments of your traffic respond to messaging. Darwin experiments gives you full control of who you target.`,
        figure: def(() => import("./FigureABRules.vue")),
      },
    ],
  },
})

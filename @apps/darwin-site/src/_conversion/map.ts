import conversionScreenshot from "./img/screenConversion.webp"
import thumbConversion from "./img/thumbConversion.webp"
import { defineAsyncComponent as def } from "vue"
import { mapTypeHelper } from "../util"

export const map = mapTypeHelper({
  conversion: {
    class: "text-blue-600",
    bgClass: "bg-blue-100",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
</svg>`,
    path: "/features/conversion",
    name: "Conversion Tracking",
    tagline: "Measure custom data",
    description:
      "Easily create events and goals to track and visualize macro and micro conversions",
    screenshot: conversionScreenshot,
    thumb: thumbConversion,

    aspects: [
      {
        align: "wide",
        tagline: "Real time conversion measurement",
        name: "Turn conversion into a science",
        description: `Fully quantify your customer acquisition costs with advanced, yet simple, conversion measurement tools.`,
        figure: def(() => import("./FigureConversionTools.vue")),
      },
      {
        align: "wide",
        tagline: "Light-weight testing and results",
        name: "Macro vs Micro",
        description: `Break goals into macro or micro conversions and weight your results accordingly. Create a formula for your traffic investments.`,
        figure: def(() => import("./FigureConversionMicroMacro.vue")),
      },
    ],
  },
})

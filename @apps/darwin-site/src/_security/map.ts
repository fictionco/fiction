import thumbBot from "./img/thumbBot.webp"
import screenSecurity from "./img/screenSecurity.webp"
import { defineAsyncComponent as def } from "vue"
import { mapTypeHelper } from "../util"

export const map = mapTypeHelper({
  bots: {
    class: "text-red-500",
    bgClass: "bg-red-50",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
</svg>`,
    path: "/features/bots",
    name: "Bot Flagging",
    tagline: "Optimize for real behavior",
    description:
      "Optimize and prioritize referrers by flagging bots and detecting fraudulent traffic",
    screenshot: screenSecurity,
    thumb: thumbBot,

    aspects: [
      {
        align: "wide",
        tagline: "Bot Referrer",
        name: "How do your bots behave?",
        description: `Use Darwin to learn how and what bots are doing on your website or app.`,
        figure: def(() => import("./FigureBot.vue")),
      },
      {
        align: "wide",
        tagline: "Bot Referrer",
        name: "Who is sending you bad traffic?",
        description: `You need to know where to spend your time and money. That's why it's important to know what traffic sources are sending you bots.`,
        figure: def(() => import("./FigureBotReferrer.vue")),
      },
    ],
  },
})

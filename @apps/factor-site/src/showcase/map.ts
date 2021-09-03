import ZenoScreenshot1 from "./zeno/screenshot-tall-1.jpg"
import ZenoScreenshot2 from "./zeno/screenshot-tall-2.jpg"
import ZenoScreenshot3 from "./zeno/screenshot-tall-3.jpg"
import ZenoScreenshot4 from "./zeno/screenshot-tall-4.jpg"
import ZenoIcon from "./zeno/icon.svg"

export interface ShowcaseItem {
  name: string
  permalink: string
  authorName: string
  authorUrl: string
  icon: string
  description: string
  screenshots: string[]
  url: string
  repo: string
  tags: string[]
}

export const map: Partial<ShowcaseItem>[] = [
  {
    name: "Zeno",
    permalink: "zeno",
    authorName: "Andrew Powers",
    authorUrl: "https://www.andrewpowers.co",
    icon: ZenoIcon,
    description:
      "Zeno is an example application/theme created specifically as a boilerplate for your project. Includes dynamic images and figures.",
    screenshots: [
      ZenoScreenshot1,
      ZenoScreenshot2,
      ZenoScreenshot3,
      ZenoScreenshot4,
    ],
    url: "https://zeno.factor.so",
    repo: "https://github.com/FactorJS/factor-app-zeno",
    tags: ["boiler-plate", "code", "saas"],
  },
]

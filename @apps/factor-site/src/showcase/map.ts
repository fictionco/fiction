import ZenoScreenshot1 from "./zeno/screenshot-tall-1.jpg"
import ZenoScreenshot2 from "./zeno/screenshot-tall-2.jpg"
import ZenoScreenshot3 from "./zeno/screenshot-tall-3.jpg"
import ZenoScreenshot4 from "./zeno/screenshot-tall-4.jpg"
import ZenoIcon from "./zeno/icon.svg"

import ApScreenshot1 from "./andrew-powers/screenshot-1.webp"
import ApScreenshot2 from "./andrew-powers/screenshot-2.webp"
import ApIcon from "./andrew-powers/icon.jpg"

import DarwinScreenshot1 from "./darwin/screenshot-1.webp"
import DarwinScreenshot2 from "./darwin/screenshot-2.webp"
import DarwinScreenshot3 from "./darwin/screenshot-3.webp"
import DarwinIcon from "./darwin/icon.png"

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
  category: string
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
    tags: ["code", "saas", "marketing"],
    category: "marketing",
  },
  {
    name: "andrewpowers.co",
    permalink: "andrew-powers",
    authorName: "Andrew Powers",
    authorUrl: "https://www.andrewpowers.co",
    icon: ApIcon,
    description:
      "A simple and clean portfolio website with markdown blog. Use it to create a bio along with search-optimized content.",
    screenshots: [ApScreenshot1, ApScreenshot2],
    url: "https://www.andrewpowers.co",
    repo: "https://github.com/FactorJS/factor-app-zeno",
    category: "portfolio",
    tags: ["code", "portfolio"],
  },
  {
    name: "Darwin",
    permalink: "darwin-site",
    authorName: "Darwin",
    authorUrl: "https://www.darwin.so",
    icon: DarwinIcon,
    description:
      "A minimalist marketing site for Darwin Analytics. Designed to highlight features and benefits.",
    screenshots: [DarwinScreenshot1, DarwinScreenshot2, DarwinScreenshot3],
    url: "https://www.darwin.so",
    category: "marketing",
    tags: ["saas", "business", "analytics", "marketing"],
  },
]

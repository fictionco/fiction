import { ExtendItem } from "../types"
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

import HnScreenshot1 from "./hn/screenshot.webp"
import HnIcon from "./hn/icon.svg"

export const map: Partial<ExtendItem>[] = [
  {
    name: "Zeno",
    permalink: "zeno",
    authorName: "Raymond Aleman",
    authorUrl: "https://github.com/finestpixels",
    icon: ZenoIcon,
    description:
      "Zeno is an example application/theme created specifically as a boilerplate for your project. Includes dynamic images and figures.",
    screenshots: [
      ZenoScreenshot1,
      ZenoScreenshot2,
      ZenoScreenshot3,
      ZenoScreenshot4,
    ],
    url: "https://zeno.factorjs.org",
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
    repo: "https://github.com/arpowers/andrew-powers-site",
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
  {
    name: "HackerNews",
    permalink: "factorjs-hacker-news",
    authorName: "Factor Team",
    authorUrl: "https://www.factorjs.org",
    icon: HnIcon,
    description: "A recreation of Hacker News built with FactorJS 3.",
    screenshots: [HnScreenshot1],
    url: "https://factor-hn.netlify.app",
    repo: "https://github.com/FactorJS/factor-example-hacker-news",
    category: "miscellaneous",
    tags: ["example", "code", "hacker-news"],
  },
]

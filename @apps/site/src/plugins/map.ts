import { ExtendItem } from "../types"
import ImgBlogEngine from "./img/blog.svg"
import ImgDocsEngine from "./img/docs.svg"
export const map: Partial<ExtendItem>[] = [
  {
    name: "Blog Engine",
    authorName: "Andrew Powers",
    authorUrl: "https://www.andrewpowers.co",
    icon: ImgBlogEngine,
    description:
      "A markdown powered blog engine, perfect for statically generated sites.",
    screenshots: [],
    url: "https://www.npmjs.com/package/@factor/plugin-blog-engine",
    repo: "https://github.com/FactorJS/factor/blob/version3/%40plugins/plugin-blog-engine/README.md",
    demo: "https://www.andrewpowers.co/blog",
    tags: ["minimal", "blog"],
    category: "blog",
  },
  {
    name: "Docs Engine",
    authorName: "Andrew Powers",
    authorUrl: "https://www.andrewpowers.co",
    icon: ImgDocsEngine,
    description:
      "A markdown powered docs engine, perfect for statically generated sites.",
    screenshots: [],
    url: "https://www.npmjs.com/package/@factor/plugin-blog-engine",
    repo: "https://github.com/FactorJS/factor/blob/version3/%40plugins/plugin-blog-engine/README.md",
    demo: "https://www.darwin.so/docs",
    tags: ["minimal", "blog"],
    category: "blog",
  },
]

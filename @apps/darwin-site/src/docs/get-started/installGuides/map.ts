import { MarkdownFile } from "@factor/types"
import { mapTypeHelper } from "@factor/plugin-docs-engine"

export const map = mapTypeHelper({
  googleTagManagerInstallation: {
    title: "Google Tag Manager",
    fileImport: (): Promise<MarkdownFile> => import("./gtm/index.md"),
  },
  wordpressInstallation: {
    title: "WordPress",
    fileImport: (): Promise<MarkdownFile> => import("./wordpress/index.md"),
  },
  shopifyInstallation: {
    title: "Shopify",
    fileImport: (): Promise<MarkdownFile> => import("./shopify/index.md"),
  },
  wixInstallation: {
    title: "Wix",
    fileImport: (): Promise<MarkdownFile> => import("./wix/index.md"),
  },
  bigcommerceInstallation: {
    title: "BigCommerce",
    fileImport: (): Promise<MarkdownFile> => import("./bigcommerce/index.md"),
  },
  clickfunnelsInstallation: {
    title: "ClickFunnels",
    fileImport: (): Promise<MarkdownFile> => import("./clickfunnels/index.md"),
  },
  squarespaceInstallation: {
    title: "Squarespace",
    fileImport: (): Promise<MarkdownFile> => import("./squarespace/index.md"),
  },
  hubspotInstallation: {
    title: "Hubspot",
    fileImport: (): Promise<MarkdownFile> => import("./hubspot/index.md"),
  },
  webflowInstallation: {
    title: "Webflow",
    fileImport: (): Promise<MarkdownFile> => import("./webflow/index.md"),
  },
  joomlaInstallation: {
    title: "Joomla",
    fileImport: (): Promise<MarkdownFile> => import("./joomla/index.md"),
  },
  instapageInstallation: {
    title: "Instapage",
    fileImport: (): Promise<MarkdownFile> => import("./instapage/index.md"),
  },
  weeblyInstallation: {
    title: "Weebly",
    fileImport: (): Promise<MarkdownFile> => import("./weebly/index.md"),
  },
})

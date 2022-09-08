<template>
  <InputSelect :list="list" v-bind="attrs" />
</template>
<script lang="ts" setup>
import { vue } from "@factor/api"

import InputSelect from "./InputSelectCustom.vue"
import googleFonts from "./lib/fonts.json"
interface FontItem {
  family: string
  variants: string[]
  category: string
}

const attrs = vue.useAttrs()

const list = vue.computed(() => {
  const l = [
    {
      name: "System Font",
      desc: "sans-serif",
      value: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    },
    {
      name: "Baskerville",
      desc: "serif",
      value: `Baskerville, 'Times New Roman', Times, serif`,
    },
    {
      name: "Futura",
      desc: "sans-serif",
      value: `Futura, 'Century Gothic', AppleGothic, sans-serif`,
    },
    {
      name: "Geneva",
      desc: "sans-serif",
      value: `Geneva, 'Lucida Sans', 'Lucida Grande', 'Lucida Sans Unicode', Verdana, sans-serif`,
    },
  ]
  const glist = googleFonts.items.map(
    ({ family, variants, category }: FontItem) => {
      const imp = `https://fonts.googleapis.com/css?family=${encodeURIComponent(
        family,
      )}:${variants.join(",")}`
      const value = `${family},${category}[link]${imp}`
      return {
        name: `${family} `,
        desc: category,
        value,
        isGoogleFont: true,
      }
    },
  )

  return [
    { format: "title", name: "Basic" },
    ...l,
    { format: "title", name: "Google Fonts" },
    ...glist,
  ]
})
</script>

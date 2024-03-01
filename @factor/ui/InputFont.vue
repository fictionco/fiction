<script lang="ts" setup>
import type { UserFont } from '@factor/api'
import { vue } from '@factor/api'

import { fonts } from '@factor/api/utils/lib/fonts'
import InputSelect from './InputSelectCustom.vue'

interface FontItem {
  family: string
  variants: string[]
  category: string
}

const list = vue.computed(() => {
  const l = [
    {
      name: 'System Font',
      desc: 'sans-serif',
      value: {
        type: 'basic',
        font: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
      },
    },
    {
      name: 'Futura',
      desc: 'sans-serif',
      value: {
        type: 'basic',
        font: `Futura, 'Century Gothic', AppleGothic, sans-serif`,
      },
    },
    {
      name: 'Geneva',
      desc: 'sans-serif',
      value: {
        type: 'basic',
        font: `Geneva, 'Lucida Sans', 'Lucida Grande', 'Lucida Sans Unicode', Verdana, sans-serif`,
      },
    },
  ].map((item) => {
    return {
      ...item,
      value: JSON.stringify(item.value),
    }
  })
  const glist = fonts.map(
    ({ family, variants, category }: FontItem) => {
      const link = `https://fonts.googleapis.com/css?family=${encodeURIComponent(family)}:${variants.join(',')}`

      const v: UserFont = {
        font: `${family},${category}`,
        link,
        type: 'google',
      }
      return {
        name: `${family} `,
        desc: category,
        value: JSON.stringify(v),
        isGoogleFont: true,
      }
    },
  )

  return [
    { format: 'title', name: 'Basic' },
    ...l,
    { format: 'title', name: 'Google Fonts' },
    ...glist.sort(),
  ]
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <InputSelect v-bind="{ ...$attrs, list }" />
</template>

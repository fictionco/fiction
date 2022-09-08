<template>
  <InputSelect :list="list" v-bind="attrs" />
</template>
<script lang="ts" setup>
import { vue, colorSchemes } from "@factor/api"

import InputSelect from "./InputSelectCustom.vue"

const attrs = vue.useAttrs()

const list = vue.computed(() => {
  const l = colorSchemes().map((scheme) => {
    return {
      name: scheme.name,
      value: JSON.stringify(scheme),
    }
  })

  return [{ format: "title", name: "Color Schemes" }, ...l]
})
</script>

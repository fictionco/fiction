<template>
  <InputSelect v-bind="{ ...$attrs, list }" />
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script lang="ts" setup>
import { vue, colorSchemes } from "@factor/api"

import InputSelect from "./InputSelectCustom.vue"

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

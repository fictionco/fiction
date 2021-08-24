<template>
  <Content />
  <component
    :is="component"
    v-for="(component, index) in globalComponents"
    :key="index"
  />
</template>

<script lang="ts">
import { applyFilters } from "@factor/api"

// eslint-disable-next-line import/no-unresolved, implicit-dependencies/no-implicit
import Content from "@src/Content.vue"
import Veil from "@factor/ui/Veil.vue"

export default {
  name: "App",
  components: {
    Content,
  },
  setup() {
    const globalComponents = applyFilters("globalComponents", [Veil])

    return { globalComponents }
  },
}
</script>

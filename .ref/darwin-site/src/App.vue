<template>
  <Content />
  <Veil />
  <Toaster />
</template>

<script lang="ts">
import Content from "./Content.vue"
import Veil from "@factor/ui/Veil.vue"
import Toaster from "@factor/plugin-notify/Toaster.vue"
export default {
  name: "App",
  components: {
    Content,
    Veil,
    Toaster,
  },
  setup() {
    return {}
  },
}
</script>

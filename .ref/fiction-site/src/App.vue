<template>
  <Content />
  <LoadingVeil />
  <NotifyToaster />
</template>

<script lang="ts">
import Content from "./Content.vue"
import LoadingVeil from "@factor/ui/LoadingVeil.vue"
import NotifyToaster from "@factor/plugin-notify/NotifyToaster.vue"
export default {
  name: "App",
  components: {
    Content,
    LoadingVeil,
    NotifyToaster,
  },
  setup() {
    return {}
  },
}
</script>

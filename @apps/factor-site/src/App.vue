<template>
  <Content />
  <LoadingVeil />
  <NotifyToaster />
</template>

<script lang="ts" setup>
import Content from "./Content.vue"
import LoadingVeil from "@factor/ui/LoadingVeil.vue"
import NotifyToaster from "@factor/plugin-notify/NotifyToaster.vue"
</script>

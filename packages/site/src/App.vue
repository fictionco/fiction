<template>
  <Content />
  <LoadingVeil />
  <NotifyToaster />
</template>

<script lang="ts" setup>
import LoadingVeil from "@factor/ui/LoadingVeil.vue"
import NotifyToaster from "@factor/plugin-notify/NotifyToaster.vue"
import Content from "./Content.vue"
</script>

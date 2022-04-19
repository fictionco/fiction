<template>
  <Content />
  <LoadingVeil :user-plugin="userPlugin" />
  <NotifyToaster />
</template>

<script lang="ts" setup>
import LoadingVeil from "@factor/ui/LoadingVeil.vue"
import NotifyToaster from "@factor/plugin-notify/NotifyToaster.vue"
import Content from "./Content.vue"
import { userPlugin } from "."
</script>

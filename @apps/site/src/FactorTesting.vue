<template>
  <div class="p-12 space-y-6 text-center">
    <div v-for="(item, i) in list" :key="i" class="">
      <div class="text-slate-500">{{ item.title }}</div>
      <div id="server-port" class="font-bold">{{ item.value }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getServerPort, currentUrl } from "@factor/engine/url"

const list = [
  { title: "Server Port", value: getServerPort() },
  { title: "Current URL", value: currentUrl() },
  { title: "TEST_ENV", value: process.env.TEST_ENV || "-" },
  { title: "NODE_ENV", value: process.env.NODE_ENV },
]
</script>

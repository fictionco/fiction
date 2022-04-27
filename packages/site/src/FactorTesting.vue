<template>
  <div class="space-y-6 p-12 text-center">
    <div v-for="(item, i) in list" :key="i" class="">
      <div class="text-slate-500">{{ item.title }}</div>
      <div :id="item.id" class="font-bold">{{ item.value }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const list = [
  {
    id: "server-url",
    title: "Server URL",
    value: process.env.FACTOR_SERVER_URL,
  },
  {
    id: "current-url",
    title: "Current URL",
    value: process.env.FACTOR_APP_URL,
  },
  { id: "test-env", title: "TEST_ENV", value: process.env.TEST_ENV || "-" },
  { id: "node-env", title: "NODE_ENV", value: process.env.NODE_ENV },
]
</script>

<template>
  <div class="space-y-6 p-12 text-center">
    <div v-for="(item, i) in list" :key="i" class="my-6">
      <div class="text-xs font-bold uppercase tracking-wider text-slate-500">
        {{ item.title }}
      </div>
      <div :id="item.id" class="text-sm font-bold">
        <span v-if="item.value" class="text-slate-800">{{ item.value }}</span>
        <span v-else class="text-red-500">[not set]</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useFactorService } from "../inject"

const { factorApp } = useFactorService()

const list = [
  {
    id: "server-url",
    title: "Server URL",
    value: process.env.SERVER_URL,
  },
  {
    id: "current-url",
    title: "Current URL",
    value: process.env.APP_URL,
  },
  {
    id: "is-test",
    title: "IS_TEST",
    value: process.env.IS_TEST,
  },
  {
    id: "node-env",
    title: "NODE_ENV",
    value: process.env.NODE_ENV,
  },
  { id: "mode", title: "MODE", value: process.env.MODE },
  {
    id: "is-vite",
    title: "IS_VITE",
    value: process.env.IS_VITE,
  },
  {
    id: "app-name",
    title: "App Name",
    value: factorApp.appName,
  },
  {
    id: "app-email",
    title: "App Name",
    value: factorApp.appEmail,
  },
  {
    id: "app-url",
    title: "Production App Name",
    value: factorApp.appUrl,
  },
]
</script>

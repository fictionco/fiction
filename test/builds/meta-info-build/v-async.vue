<template>
  <h1>Async</h1>
</template>

<script lang="ts">
import { storeItem, stored } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  metaInfo() {
    return stored("test") || {}
  },
  serverPrefetch() {
    return this.prefetch()
  },
  methods: {
    async prefetch() {
      const r = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            title: "async-title",
            description: "async-description",
          })
        }, 100)
      })

      storeItem("test", r)
      return
    },
  },
})
</script>

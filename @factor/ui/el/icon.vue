<template>
  <i class="factor-icon" :class="icon" />
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  props: {
    icon: { type: String, default: "" }
  },
  metaInfo: {
    link: [
      {
        vmid: "fa",
        rel: "stylesheet",
        href:
          "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.12.1/css/all.min.css"
      }
    ]
  }
})
</script>

<style lang="less">
</style>

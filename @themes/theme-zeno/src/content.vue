<template>
  <div>
    <header-primary />
    <div>
      <router-view />
      <footer-primary />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  components: {
    "header-primary": () => import("./header.vue"),
    "footer-primary": () => import("./footer.vue")
  },
  metaInfo() {
    return {
      title: "No Title",
      titleTemplate: "%s - Factor JS"
    }
  }
})
</script>

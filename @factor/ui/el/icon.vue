<template>
  <i class="factor-icon" :class="icon" />
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  props: {
    icon: { type: String, default: "" }
  },
  mounted() {
    this.addExternalScripts()
  },
  methods: {
    // Add dynamically since webpack tried to include as a module. Is there a better way?
    addExternalScripts() {
      const els = document.querySelector("#ficons")
      if (!els) {
        document.createElement("script")
        const script = document.createElement("script")
        script.src = "https://kit.fontawesome.com/4cb195f1ee.js"
        script.type = "text/javascript"
        script.id = "ficons"
        script.crossOrigin = "anonymous"
        document.querySelectorAll("head")[0].append(script)
      }
    }
  }
})
</script>


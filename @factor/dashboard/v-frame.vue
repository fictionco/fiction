<template>
  <iframe id="app-frame" class="frame" :src="currentUrl" />
</template>

<script lang="ts">
import Vue from "vue"
import { currentUrl } from "@factor/api"
export default Vue.extend({
  components: {},
  data() {
    return {
      appIFrame: "",
      factorApp: undefined,
    }
  },
  computed: {
    currentUrl,
    appEvents(this: any) {
      return this.factorApp?.events
    },
  },
  metaInfo() {
    return {
      title: "View Site",
    }
  },
  mounted(this: any) {
    this.appIFrame = document.querySelector("#app-frame")
    this.appIFrame.addEventListener("load", () => {
      const doc = this.appIFrame.contentWindow || this.appIFrame.contentDocument
      this.factorApp = doc.factorApp
      window.factorFrame = doc
      this.handleEvents()
    })
  },
  methods: {
    handleEvents(this: any) {
      if (this.appEvents) {
        this.appEvents.onEvent("userAuthenticated", () => this.reload())
      }
    },
    reload() {
      location.reload()
    },
  },
})
</script>

<style lang="less">
.frame {
  background-color: #fff;
  width: 100%;
  height: 100vh;
}
</style>

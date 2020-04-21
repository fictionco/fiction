<template>
  <div ref="code" class="highlight-code-wrap">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from "vue"

import { onEvent } from "@factor/api"
export default Vue.extend({
  data() {
    return {
      loading: true,
    }
  },
  mounted(this: any) {
    if (window.Prism) {
      this.prism = window.Prism

      if (window.Prism.languages.bash) {
        window.Prism.languages.bash = window.Prism.languages.extend("bash", {
          variable: /\b(?:start|build|serve|dev|run|setup)\b/,
          function: /\b(?:yarn|npx|npm)\b/,
        })
      }
    }

    // Set page on load
    this.setPage()

    // Event trigger for rehighlight
    onEvent("highlight-post", () => {
      this.setPage()
    })
  },
  metaInfo: {
    link: [],
    script: [
      {
        vmid: "prism",
        src: "https://cdn.jsdelivr.net/npm/prismjs@1.19.0/prism.min.js",
      },
      {
        vmid: "prism-bash",
        src: "https://cdn.jsdelivr.net/npm/prismjs@1.19.0/components/prism-bash.min.js",
      },
      {
        vmid: "prism-ts",
        src:
          "https://cdn.jsdelivr.net/npm/prismjs@1.19.0/components/prism-typescript.min.js",
      },
      {
        vmid: "prism-json",
        src: "https://cdn.jsdelivr.net/npm/prismjs@1.19.0/components/prism-json.min.js",
      },
      {
        vmid: "prism-yaml",
        src: "https://cdn.jsdelivr.net/npm/prismjs@1.19.0/components/prism-yaml.min.js",
      },
      {
        vmid: "prism-less",
        src: "https://cdn.jsdelivr.net/npm/prismjs@1.19.0/components/prism-less.min.js",
      },
      {
        vmid: "prism-autoload",
        src:
          "https://cdn.jsdelivr.net/npm/prismjs@1.19.0/plugins/autoloader/prism-autoloader.min.js",
      },
    ],
  },
  methods: {
    setPage(this: any) {
      if (this.prism && this.$refs.code) {
        // wait til content is done rendering
        this.prism.highlightAllUnder(this.$refs.code)
      }
    },
  },
})
</script>
<style src="./prism/theme-vscode.less" lang="less"></style>

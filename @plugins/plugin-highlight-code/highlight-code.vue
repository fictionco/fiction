<template>
  <div ref="code" class="highlight-code-wrap">
    <slot />
  </div>
</template>

<script lang="ts">
import { onEvent } from "@factor/api"
export default {
  data() {
    return {
      tries: 0,
      loading: true,
    }
  },
  mounted(this: any) {
    // Set page on load
    this.setPage()

    // Event trigger for rehighlight
    onEvent("highlight-code", () => {
      setTimeout(() => this.setPage(), 50)
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
      if (window.Prism && this.$refs.code) {
        this.tries = 0
        this.prism = window.Prism

        if (this.prism.languages.bash) {
          this.prism.languages.bash = this.prism.languages.extend("bash", {
            variable: /\b(?:start|build|serve|dev|run|setup)\b/,
            function: /\b(?:yarn|npx|npm)\b/,
          })
        }

        // wait til content is done rendering
        this.prism.highlightAllUnder(this.$refs.code)
      } else if (this.tries < 5) {
        setTimeout(() => {
          this.tries++
          this.setPage()
        }, 50)
      }
    },
  },
}
</script>
<style src="./prism/theme-vscode.less" lang="less"></style>

<template>
  <div class="highlight-code-wrap">
    <slot />
  </div>
</template>
<script>
export default {
  // watch: {
  //   $route: {
  //     handler: function(to, from) {
  //       if (to.path != from.path) {
  //         this.setPage()
  //       }
  //     }
  //   }
  // },
  mounted() {
    require("./prism/prism.js")
    this.prism = window.Prism
    this.setPage()
  },
  methods: {
    setPage() {
      if (this.prism) {
        // wait til content is done rendering
        setTimeout(() => {
          this.prism.highlightAll()
        }, 500)
      }
    }
  }
}
</script>
<style lang="less">
@import "./prism/prism.less";

.code-toolbar {
  font-family: "Roboto Mono", Monaco, courier, monospace;
  padding: 1em 2em;
  border-radius: 5px;
  margin-bottom: 1.5rem;
  background-color: rgba(0, 0, 0, 0.02);
  font-family: "Roboto Mono", Monaco, courier, monospace;
  font-size: 0.85em;
  -webkit-font-smoothing: initial;
  -moz-osx-font-smoothing: initial;
}
</style>
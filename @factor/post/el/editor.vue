<template>
  <div class="editor-input">
    <div v-show="!loading" class="editor-wrap">
      <textarea ref="editor" :value="value" v-on="listeners"></textarea>
    </div>
  </div>
</template>

<script lang="ts">
import EasyMDE from "easymde"

import Vue from "vue"
export default Vue.extend({
  components: {},
  props: {
    value: { type: String, default: "" }
  },
  data() {
    return {
      editor: null,
      session: null,
      content: "",
      loading: true
    }
  },
  computed: {
    listeners(this: any) {
      return {
        ...this.$listeners,
        change: (event: Event & { target: HTMLInputElement }) =>
          this.$emit("input", event.target.value)
      }
    }
  },

  mounted(this: any) {
    this.easyMDE = new EasyMDE({
      element: this.$refs.editor,
      spellChecker: false,
      forceSync: true,
      shortcuts: {}
    })

    this.easyMDE.codemirror.on("change", () => {
      this.$emit("input", this.easyMDE.value())
    })

    this.loading = false
  },
  methods: {}
})
</script>


<style lang="less">
@import url(https://unpkg.com/easymde/dist/easymde.min.css);
.editor-input {
  .CodeMirror {
    padding: 1rem;
    font-size: 1.1rem;
    line-height: 1.6;
  }
  .editor-toolbar,
  .CodeMirror {
    color: inherit;
    border: none;
    background-color: var(--input-bg);
    box-shadow: var(--box-shadow-input);
  }
}
</style>

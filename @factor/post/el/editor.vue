<template>
  <div class="editor-input">
    <textarea ref="editor" :value="value" v-on="listeners"></textarea>
    <!-- <pre id="editor" ref="editor" class="editor" @keyup="$emit('keyup')" /> -->
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

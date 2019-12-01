<template>
  <textarea
    ref="textarea"
    class="standard-textarea"
    :value="value"
    :required="$attrs.required"
    v-bind="$attrs"
    :placeholder="$attrs.placeholder"
    :class="value ? 'set' : 'empty'"
    v-on="listeners"
    @input="setHeight()"
  />
</template>

<script>
import { DOM } from "@factor/tools"
import Vue from "vue"
export default Vue.extend({
  props: {
    value: { type: [String, Number], default: "" }
  },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: event => this.$emit("input", event.target.value)
      }
    }
  },
  mounted() {
    this.$watch(
      `value`,
      function() {
        this.setHeight()
      },
      { immediate: true }
    )
  },

  methods: {
    setHeight() {
      const ta = DOM(this.$refs.textarea)
      if (ta.length != 0) {
        const sh = ta.height(0).get(0).scrollHeight
        ta.height(sh)
      }
    }
  }
})
</script>

<style lang="less">
textarea.standard-textarea {
  width: 100%;
  min-height: 5em;
  line-height: 1.5;
}
</style>

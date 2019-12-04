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

<script lang="ts">
import DOM from "jquery"
import Vue from "vue"
export default Vue.extend({
  props: {
    value: { type: [String, Number], default: "" }
  },
  computed: {
    listeners(this: any) {
      return {
        ...this.$listeners,
        input: (event: any) => this.$emit("input", event.target.value)
      }
    }
  },
  mounted() {
    this.$watch(
      `value`,
      function(this: any) {
        this.setHeight()
      },
      { immediate: true }
    )
  },

  methods: {
    setHeight(this: any) {
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

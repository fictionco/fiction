<template lang="pug">
  textarea.form-control(
    ref="textarea"
    :value="value"
    :required="$attrs.required"
    v-bind="$attrs"
    :placeholder="$attrs.placeholder"
    :class="value ? 'set' : 'empty'"
    v-on="listeners"
    @input="setHeight()")
</template>
<script lang="ts">
export default {
  props: {
    value: { type: [String, Number], default: "" },
  },
  watch: {
    value: {
      handler: "setHeight",
      immediate: true,
    },
  },
  computed: {
    listeners(this: any) {
      return {
        ...this.$listeners,
        input: (event: Event & { target: HTMLInputElement }) =>
          this.$emit("input", event.target.value),
      }
    },
  },
  methods: {
    setHeight() {
      const ta = this.$refs.textarea as HTMLInputElement
      if (ta) {
        ta.style.height = `${ta.scrollHeight + 2}px`
      }
    },
  },
}
</script>

<style lang="less">
textarea.form-control {
  min-height: 5em;
}
</style>

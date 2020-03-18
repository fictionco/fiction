<template>
  <div class="input-item">
    <transition appear>
      <label v-if="value">{{ input.label }}</label>
    </transition>
    <input
      v-bind="$attrs"
      :value="value"
      :type="input.type"
      :placeholder="input.label"
      v-on="listeners"
    />
  </div>
</template>
<script>
import Vue from "vue"
export default Vue.extend({
  props: {
    input: { type: Object, default: () => {} },
    value: { type: String, default: "" }
  },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: event => this.$emit("input", event.target.value)
      }
    }
  }
})
</script>
<style lang="less">
.input-item {
  margin: 1rem 0;
  label {
    display: block;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--color-placeholder);
  }
  input {
    background-color: var(--color-bg-contrast);
    font-size: 1.2rem;
  }
}
</style>

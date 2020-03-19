<template>
  <div class="input-item">
    <transition appear>
      <label v-if="input.label || input.placeholder">{{ input.label }}</label>
    </transition>

    <input
      v-bind="$attrs"
      :value="value"
      :type="input.type"
      :placeholder="input.placeholder || input.label"
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
  margin: 1.5rem 0;
  label {
    display: block;
    font-weight: 700;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    color: var(--color-placeholder);

    letter-spacing: 0.5px;
    font-size: 0.9em;
  }
  .description {
    margin: 0.5rem 0 0;
    opacity: 0.2;
    font-size: 12px;
    font-weight: 700;
    text-align: center;
  }
  input {
    background-color: var(--color-bg-contrast);
    font-size: 1.2rem;
  }
}
</style>

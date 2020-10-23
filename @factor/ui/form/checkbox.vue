<template>
  <label class="factor-input checkbox-wrap">
    <input type="checkbox" class="checkbox" :checked="value" v-on="listeners" />
    <span v-if="label" class="checkbox-label">{{ label }}</span>
  </label>
</template>
<script lang="ts">
export default {
  props: {
    value: { type: [String, Boolean, Array], default: false },
    label: { type: String, default: "" },
  },
  computed: {
    listeners(this: any) {
      return {
        ...this.$listeners,
        input: (event: Event & { target: HTMLInputElement }) => {
          this.$emit("input", event.target.checked)
        },
      }
    },
  },
}
</script>
<style lang="less">
.checkbox-wrap {
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  .checkbox {
    margin-right: 0.5rem;
  }
}
</style>

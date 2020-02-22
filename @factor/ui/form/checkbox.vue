<template>
  <label class="checkbox-wrap">
    <input type="checkbox" class="checkbox" :checked="value" v-on="listeners" />
    <span v-if="label" class="checkbox-label">{{ label }}</span>
  </label>
</template>
<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    value: { type: [String, Boolean, Array], default: false },
    label: { type: String, default: "" }
  },

  data() {
    return {
      val: false
    }
  },
  computed: {
    listeners(this: any) {
      return {
        ...this.$listeners,
        input: (event: Event & { target: HTMLInputElement }) => {
          this.$emit("change", event.target.value)
        }
      }
    }
  }
})
</script>
<style lang="less"></style>

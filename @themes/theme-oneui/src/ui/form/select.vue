<template lang="pug">
  select.form-control(
    :value="setting"
    :required="$attrs.required"
    :style="inputStyle"
    v-on="listeners"
  )
    option(disabled value v-text="$attrs.placeholder || 'Select'")
    option(
      v-for="(s, i) in parsedList"
      :key="i"
      :value="s.value"
      :disabled="s.disabled"
      v-text="s.label || s.name")
  
</template>
<script lang="ts">
import { parseList, ListItem } from "@factor/api"

export default {
  props: {
    value: { type: [Number, String, Boolean], default: "" },
    list: { type: Array, default: () => [] },
    listSuffix: { type: String, default: "" },
    caretColor: { type: String, default: "#9ab5ca" },
  },
  data() {
    return {
      selected: "",
    }
  },
  computed: {
    listeners(this: any) {
      return {
        ...this.$listeners,
        input: (event: Event) => {
          const target = event.target as HTMLInputElement
          this.$emit("input", target.value)
        },
      }
    },
    setting(this: any) {
      return typeof this.value != "undefined" ? this.value : undefined
    },

    parsedList(this: any): ListItem[] {
      return this.list
        ? parseList(this.list, {
            suffix: this.listSuffix,
          })
        : []
    },
    inputStyle(this: any) {
      return {}
    },
  },
}
</script>

<style lang="less"></style>

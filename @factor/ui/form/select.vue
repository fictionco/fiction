<template>
  <select
    :value="setting"
    class="select-standard"
    :required="$attrs.required"
    :style="inputStyle"
    v-on="listeners"
  >
    <option disabled value>{{ $attrs.placeholder || "Select" }}</option>
    <option
      v-for="(s, i) in parsedList"
      :key="i"
      :value="s.value"
      :disabled="s.disabled"
    >{{ s.label || s.name }}</option>
  </select>
</template>
<script lang="ts">
import { parseList, ListItem } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  props: {
    value: { type: [Number, String, Boolean], default: "" },
    list: { type: Array, default: () => [] },
    listSuffix: { type: String, default: "" }
  },
  data() {
    return {
      selected: ""
    }
  },
  computed: {
    listeners(this: any) {
      return {
        ...this.$listeners,
        input: (event: Event) => {
          const target = event.target as HTMLInputElement
          this.$emit("input", target.value)
        }
      }
    },
    setting(this: any) {
      return typeof this.value != "undefined" ? this.value : undefined
    },

    parsedList(this: any): ListItem[] {
      return this.list
        ? parseList(this.list, {
            suffix: this.listSuffix
          })
        : []
    },
    inputStyle() {
      return {
        backgroundImage: `url(${require("./img/select.svg")})`
      }
    }
  }
})
</script>

<style lang="less">
select.select-standard {
  width: auto;
  max-width: 100%;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding: 0.5em 1.4em 0.5em 0.8em;
  background-size: 0.6em;
  background-image: url("/img/select.svg");
  background-repeat: no-repeat;
  background-position: right 0.6em center;
  padding-right: 2em;
  cursor: pointer;
}
</style>

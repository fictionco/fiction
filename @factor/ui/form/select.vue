<template>
  <select
    :value="setting"
    class="factor-input select-standard"
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
      return {
        backgroundImage: `url("${this.svg()}")`,
      }
    },
  },
  methods: {
    svg() {
      const clr = encodeURIComponent(this.caretColor)
      // https://yoksel.github.io/url-encoder/
      return `data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg version='1.1' id='Outline_Icons' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 28 28' style='enable-background:new 0 0 28 28;' xml:space='preserve'%3E%3Cpath fill='${clr}' d='M26.8,6c-0.4-0.4-0.9-0.5-1.4-0.5c-0.5,0-1,0.3-1.4,0.7L14,17.5L4,6.2C3.6,5.8,3.2,5.5,2.6,5.5C2.1,5.5,1.6,5.7,1.2,6 C0.3,6.7,0.3,8,1,8.8l11.5,13c0.4,0.4,0.9,0.7,1.5,0.7c0.6,0,1.1-0.2,1.5-0.7L27,8.8c0.4-0.4,0.5-0.9,0.5-1.4S27.2,6.4,26.8,6z'/%3E%3C/svg%3E%0A`
    },
  },
}
</script>

<style lang="less">
select.select-standard {
  width: auto;
  max-width: 100%;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding: 0.5em 1.4em 0.5em 0.8em;
  background-size: 0.6em;

  background-repeat: no-repeat;
  background-position: right 0.6em center;
  padding-right: 2em;
  cursor: pointer;
  line-height: 1.2;
}
</style>

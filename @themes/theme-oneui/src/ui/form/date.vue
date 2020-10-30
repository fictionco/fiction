<template lang="pug">
  flat-pickr.form-control.bg-white(placeholder="Y-m-d" v-model="dateDefault" v-on="listeners")
</template>

<script lang="ts">
import flatpickr from "flatpickr"
import { German } from "flatpickr/dist/l10n/de"
import vueFlatPickr from "vue-flatpickr-component"
import { toDate } from "@factor/api"

flatpickr.localize(German)

export default {
  components: {
    flatPickr: vueFlatPickr,
  },
  props: {
    value: { type: [String, Date], default: null },
  },
  data() {
    return {
      date: null,
      dateDefault: null,
    }
  },
  computed: {
    val() {
      return this.value ? toDate(this.value) : ""
    },
    listeners() {
      return {
        ...this.$listeners,
        input: (date: string) => {
          this.$emit("input", new Date(date).toISOString())
        },
      }
    },
  },
}
</script>

<style lang="scss">
@import "~flatpickr/dist/flatpickr.css";
@import "../../assets/scss/vendor/flatpickr";
</style>

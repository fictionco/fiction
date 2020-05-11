<template>
  <input
    class="factor-input phone-inputs"
    :value="phone"
    type="tel"
    v-bind="$attrs"
    pattern="^[0-9-+s()]{6,16}"
    autocomplete="tel"
    size="15"
    title="Enter a valid phone number with country code."
    :required="$attrs.required"
    v-on="listeners"
  />
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
  props: {
    value: { type: [String, Number], default: "" },
  },
  data() {
    return {}
  },
  computed: {
    phone(this: any) {
      return this.value ? this.addPlus(String(this.value)) : ""
    },
    listeners(this: any) {
      return {
        ...this.$listeners,
        input: (e) => {
          this.send(e.target.value)
        },
      }
    },
  },

  methods: {
    addPlus(v) {
      if (v != "" && !v.startsWith("+")) {
        v = `+${v}`
      }
      return v
    },
    send(e) {
      this.$emit("input", this.addPlus(e))
    },
  },
}
</script>

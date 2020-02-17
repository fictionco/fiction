<template>
  <form ref="form" class="wrap-form" autocomplete="on" @submit="checkForm($event)">
    <slot />
    <input ref="send" class="submit" type="submit" value="submit" />
  </form>
</template>
<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  props: {
    save: { type: Boolean, default: false },
    watchValid: { type: Object, default: () => {} }
  },
  watch: {
    save: function(this: any, v) {
      if (v) {
        this.$refs.send.click()
        this.$emit("update:save", false)
      }
    }
  },
  mounted() {
    this.$watch(
      "watchValid",
      function(this: any) {
        this.$nextTick(() => {
          this.$emit("valid", this.$refs["form"].checkValidity())
        })
      },
      { deep: true, immediate: true }
    )
  },
  methods: {
    checkForm(this: any, e: Event) {
      e.preventDefault()
      this.$emit("submit", e)
    }
  }
})
</script>
<style lang="less">
.wrap-form {
  input[type="submit"] {
    display: none;
  }
}
</style>

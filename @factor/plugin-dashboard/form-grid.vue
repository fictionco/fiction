<template>
  <form ref="form" class="form-grid" autocomplete="on">
    <div class="grid-main">
      <slot />
    </div>
    <div class="grid-sub">
      <slot name="sub" />
    </div>
  </form>
</template>
<script>
export default {
  props: {
    save: { type: Boolean, default: false },
    watchValid: { type: Object, default: () => {} }
  },
  watch: {
    save: function(v) {
      if (v) {
        this.$refs.send.click()
        this.$emit("update:save", false)
      }
    }
  },
  mounted() {
    this.$watch(
      "watchValid",
      function(v) {
        this.$nextTick(() => {
          this.$emit("valid", this.$refs["form"].checkValidity())
        })
      },
      { deep: true, immediate: true }
    )
  },
  methods: {
    checkForm(e) {
      e.preventDefault()
      this.$emit("submit", e)
    }
  }
}
</script>
<style lang="less">
.form-grid {
  padding: 1.5em;
  display: grid;
  grid-gap: 3em;
  grid-template-columns: 3fr 1fr;
  .grid-main {
    min-width: 0;
  }
  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    grid-gap: 1em;
  }
}
</style>

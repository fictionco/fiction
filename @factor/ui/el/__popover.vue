<template>
  <div class="popover-wrap" :class="toggle ? 'active': 'not-active'" @click.stop>
    <div v-if="toggle" class="popover">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    btnText: { type: String, default: "Toggle" },
    btnSize: { type: String, default: "tiny" },
    toggleClass: { type: String, default: "" },
    toggle: { type: Boolean, default: false }
  },
  data() {
    return {
      clickHandler: null
    }
  },
  watch: {
    toggle: "setToggle"
  },
  methods: {
    setToggle() {
      this.clickHandler = () => {
        if (this.toggle) {
          this.$emit("update:toggle", false)
          document.removeEventListener("click", this.clickHandler, false)
        }
      }
      if (this.toggle) {
        document.addEventListener("click", this.clickHandler, false)
      } else {
        document.removeEventListener("click", this.clickHandler, false)
      }
    }
  }
}
</script>

<style lang="less">
.popover-wrap {
  position: relative;
}
.popover {
  background: #fff;
  padding: 1em;
  z-index: 100;
  position: absolute;
  top: calc(~"100% + 10px");
  left: 0;
  width: 300px;
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08), 0 6px 14px 0 rgba(24, 32, 41, 0.06),
    0 12px 34px 0 rgba(24, 32, 41, 0.04);
}
</style>


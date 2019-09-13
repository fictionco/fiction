<template>
  <div class="form-submit">
    <component :is="btnComponent" v-bind="$attrs" type="submit" v-on="$listeners">
      <slot />
    </component>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
    el: { type: String, default: "" }
  },
  computed: {
    btnComponent() {
      return this.el ? this.el : "factor-btn-dashboard"
    }
  }
}
</script>

<style lang="less">
.form-submit {
  text-align: right;
  margin: 2em 0;
}
</style>

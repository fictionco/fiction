<template>
  <div class="form-submit">
    <factor-btn v-bind="$attrs" type="submit" v-on="$listeners">
      <slot />
    </factor-btn>
  </div>
</template>
<script>
export default {
  inheritAttrs: false
}
</script>

<style lang="less">
.form-submit {
  text-align: right;
  margin: 2em 0;
}
</style>

<template>
  <div class="el-tag">
    <slot v-if="$slots.default" />
    <span v-else-if="text" v-formatted-text="text" class="text" />
  </div>
</template>
<script>
export default {
  props: {
    text: { type: String, default: "" }
  },
  data() {
    return {}
  },
  computed: {}
}
</script>
<style lang="less">
.el-tag {
  font-size: 0.9em;
  border-radius: 1em;
  padding: 0.2em 0.8em 0.2em 0.8em;
  line-height: 1.4;

  //box-shadow: @factor-box-shadow-input;

  display: inline-block;
  text-align: center;
}
</style>

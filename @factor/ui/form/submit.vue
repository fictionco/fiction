<template>
  <div class="form-submit">
    <component :is="btnComponent" v-bind="$attrs" type="submit" v-on="$listeners">
      <slot />
    </component>
  </div>
</template>
<script lang="ts">
import { factorBtn } from "@factor/ui"
import Vue from "vue"
export default Vue.extend({
  components: { factorBtn },
  inheritAttrs: false,
  props: {
    el: { type: String, default: "" }
  },
  computed: {
    btnComponent(this: any) {
      return this.el ? this.el : factorBtn
    }
  }
})
</script>

<style lang="less">
.form-submit {
  text-align: right;
  margin: 2em 0;
}
</style>

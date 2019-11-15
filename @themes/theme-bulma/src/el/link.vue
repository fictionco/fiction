<template>
  <factor-link class="app-input" v-bind="$attrs" btn-element="app-btn" v-on="$listeners">
    <slot />
  </factor-link>
</template>

<script>
import { factorLink } from "@factor/ui"
import Vue from "vue"
export default Vue.extend({
  components: { factorLink }
})
</script>
<style lang="less">
.btn-link {
  + .app-btn,
  + .btn-link {
    margin-left: 5px;
    @media (max-width: 767px) {
      margin-left: 0;
      margin-top: 1em;
    }
  }
}
</style>

<template>
  <factor-link class="app-input" v-bind="$attrs" v-on="$listeners">
    <slot />
  </factor-link>
</template>
<script lang="ts">
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
    margin-left: 10px;
    @media (max-width: 900px) {
      margin-left: 0;
      margin-top: 1em;
    }
  }
}
</style>

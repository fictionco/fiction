<template>
  <factor-link
    class="dashboard-input"
    v-bind="$attrs"
    btn-element="factor-btn-dashboard"
    v-on="$listeners"
  >
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

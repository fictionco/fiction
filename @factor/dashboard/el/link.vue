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
<script>
import { factorLink } from "@factor/ui"
export default {
  components: { factorLink }
}
</script>

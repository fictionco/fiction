<template>
  <div class="site-brand">
    <factor-link path="/">
      <component :is="setting(`site.logo`)" />
    </factor-link>
  </div>
</template>

<script>
import { factorLink } from "@factor/ui"
import { setting } from "@factor/tools"
export default {
  components: { factorLink },
  methods: { setting }
}
</script>

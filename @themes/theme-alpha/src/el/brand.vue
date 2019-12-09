<template>
  <div class="brand">
    <factor-link path="/">
      <component :is="setting(`site.logo`)" />
    </factor-link>
  </div>
</template>

<script lang="ts">
import { factorLink } from "@factor/ui"
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: { factorLink },
  methods: { setting }
})
</script>

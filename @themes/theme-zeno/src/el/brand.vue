<template>
  <factor-link path="/">
    <img v-if="inverse" :src="setting(`site.logoInverse`)" :alt="`Zeno`" class="h-8" />
    <img v-else :src="setting(`site.logo`)" :alt="`Zeno`" class="h-8" />
  </factor-link>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { setting } from "@factor/tools"
import Vue from "vue"

export default Vue.extend({
  components: { factorLink },
  props: {
    inverse: { type: Boolean, default: false }
  },
  methods: { setting }
})
</script>

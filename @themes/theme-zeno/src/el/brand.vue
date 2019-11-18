<template>
  <factor-link path="/">
    <img :src="setting(`site.logo`)" :alt="`Zeno`" class="h-8" />
  </factor-link>
</template>
<script>
import { factorLink } from "@factor/ui"
import { setting } from "@factor/tools"
import Vue from "vue"
export default Vue.extend({
  components: { factorLink },
  methods: { setting }
})
</script>

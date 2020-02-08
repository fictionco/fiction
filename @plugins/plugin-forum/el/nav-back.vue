<template>
  <factor-link :path="home" class="nav-back">&larr; Back to All Discussions</factor-link>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { setting } from "@factor/api/settings"
import Vue from "vue"
export default Vue.extend({
  components: { factorLink },
  computed: {
    home() {
      return setting(`forum.indexRoute`)
    }
  }
})
</script>
<style lang="less">
.nav-back {
  display: inline-block;
  font-size: 0.9em;
  margin-bottom: 2rem;
}
</style>

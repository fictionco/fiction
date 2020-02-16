<template>
  <factor-link :path="home" class="nav-back">&larr; All Discussions</factor-link>
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
}
</style>

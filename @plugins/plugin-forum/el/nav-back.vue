<template>
  <factor-link :path="home" btn="default" class="nav-back">&larr; All Discussions</factor-link>
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
a.nav-back {
  display: inline-block;
  font-weight: 700;
  color: inherit;
  &:hover {
    opacity: 1;
  }
}
</style>

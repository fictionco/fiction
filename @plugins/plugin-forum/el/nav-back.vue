<template>
  <factor-link :path="home" btn="default" class="nav-back">
    <span v-formatted-text="setting('forum.text.backToAll')" />
  </factor-link>
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
    },
  },
  methods: {
    setting,
  },
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

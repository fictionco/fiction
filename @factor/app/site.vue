<template>
  <div id="app" class="factor-site" :class="classes">
    <router-view></router-view>
    <component :is="component" v-for="({component}, index) in injectedComponents" :key="index" />
  </div>
</template>
<style src="~/.factor/loader-styles.less" lang="less"></style>
<script>
import siteMixin from "./site-mixin"
import { applyFilters } from "@factor/tools"
export default {
  name: "Site",
  mixins: applyFilters("site-mixins", [siteMixin()])
}
</script>
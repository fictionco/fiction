<template>
  <div id="app" class="factor-site" :class="classes">
    <router-view />
    <component :is="component" v-for="(component, k) in injectedComponents" :key="k" />
  </div>
</template>
<style src="~/.factor/loader-styles.less" lang="less"></style>
<script>
import siteMixin from "./site-mixin"
import { applyFilters } from "@factor/tools"
export default {
  mixins: applyFilters("site-mixins", [siteMixin()])
}
</script>
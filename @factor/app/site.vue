<template>
  <div id="app" class="factor-site" :class="classes">
    <component :is="component" v-for="(component, index) in injectedComponents" :key="index" />
    <router-view></router-view>
  </div>
</template>
<style src="~/.factor/loader-styles.less" lang="less"></style>
<script>
import siteMixin from "./site-mixin"
import { applyFilters } from "@factor/tools"
import Vue from "vue"
export default Vue.extend({
  name: "Site",
  mixins: applyFilters("site-mixins", [siteMixin()])
})
</script>

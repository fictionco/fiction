<template>
  <div id="app" class="factor-site" :class="classes">
    <router-view />
    <component :is="component" v-for="(component, index) in injectedComponents" :key="index" />
  </div>
</template>

<script lang="ts">
import { applyFilters } from "@factor/api"
import Vue from "vue"

import siteMixin from "./site-mixin"
export default Vue.extend({
  name: "Site",
  mixins: applyFilters("site-mixins", [siteMixin()])
})
</script>
<style lang="less">
@import (optional) "~__CWD__/.factor/loader-styles.less";
</style>

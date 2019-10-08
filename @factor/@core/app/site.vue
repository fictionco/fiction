<template>
  <div id="app" class="factor-site" :class="classes">
    <router-view />
    <component :is="component" v-for="(component, k) in injectedComponents" :key="k" />
  </div>
</template>
<style src="~/.factor/loader-styles.less" lang="less"></style>
<script>
import Factor from "vue"

export default {
  mixins: Factor.$filters.apply("site-mixins", [])
}
</script>
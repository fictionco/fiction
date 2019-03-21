<template>
  <div id="app" class="factor-app">
    <router-view />
    <component :is="component" v-for="(component, k) in injectedComponents" :key="k" />
  </div>
</template>
<script>
export default {

  computed: {
    injectedComponents(){
      return this.$filters.apply('site-components')
    }
  }
}
</script>
<template>
  <div class="factor-extend" :class="$route.path.includes('plugin') ? 'plugin' : 'themes'">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({})
</script>

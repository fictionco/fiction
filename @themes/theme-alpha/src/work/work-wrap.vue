<template>
  <div class="work-wrap">
    <router-view />
    <el-cta />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  components: {
    "el-cta": () => import("../el/cta.vue")
  }
})
</script>
<template>
  <div class="work-wrap">
    <router-view />
    <el-cta />
  </div>
</template>

<script lang="ts">
export default {
  components: {
    "el-cta": () => import("../el/cta.vue")
  }
}
</script>
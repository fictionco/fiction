<template>
  <div class="content-layout">
    SUP ray?
    <router-view />
  </div>
</template>
<script lang="ts">
export default {
  name: "ContentWrap",
  components: {},
  metaInfo() {
    return {
      titleTemplate: "%s - Darwin Analytics",
      link: [],
    }
  },
}
</script>

<style lang="less">
.content-layout {
}
</style>

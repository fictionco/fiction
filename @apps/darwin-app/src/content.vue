<template>
  <div class="content-layout">
    sup
    <router-view />
  </div>
</template>
<script lang="ts">
export default {
  name: "ContentWrap",
  components: {},
  metaInfo() {
    return {
      titleTemplate: "%s - Factor",
      link: [],
    }
  },
}
</script>

<style lang="less">
.content-layout {
}
</style>

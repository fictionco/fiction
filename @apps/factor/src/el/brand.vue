<template>
  <div class="brand">
    <factor-link path="/">
      <component :is="setting(`site.logo`)" />
    </factor-link>
  </div>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { setting } from "@factor/api"

export default {
  components: { factorLink },
  methods: { setting },
}
</script>
<style lang="less">
.brand {
  display: flex;

  align-items: center;
  width: 100px;
  a img {
    width: 80px;
  }
}
</style>

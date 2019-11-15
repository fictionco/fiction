<template>
  <div>
    <factor-link path="/">
      <img :src="setting(`site.logo`)" :alt="`Zeno`" />
      <!-- <component :is="setting(`site.logo`)" /> -->
    </factor-link>
  </div>
</template>
<script>
import { setting } from "@factor/tools"
export default {
  methods: { setting }
}
</script>
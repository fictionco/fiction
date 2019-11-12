<template>
  <div>
    <factor-link path="/">
      <component :is="setting(`site.logo`)" />
    </factor-link>
  </div>
</template>
<script>
import { setting } from "@factor/tools"
export default {
  methods: { setting }
}
</script>
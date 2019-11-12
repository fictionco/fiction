<template>
  <div>
    <div>
      <factor-link path="https://www.fiction.com">
        <component :is="setting(`footer.logo`)" />
      </factor-link>
    </div>
    <div>
      <div v-formatted-text="setting('footer.headline')" />
      <div v-formatted-text="setting('footer.legal')" />
    </div>
  </div>
</template>
<script>
import { setting } from "@factor/tools"
export default {
  methods: { setting }
}
</script>
<template>
  <div class="splash">
    <div class="splash-content">
      <h1>Factor Plugin Demos</h1>
      <div class="sub">Checkout demos of Factor extensions</div>

      <div class="actions">
        <plugin-selector />
      </div>
    </div>

    <div class="home">
      <factor-link path="https://factor.dev">Back for Factor Home &rarr;</factor-link>
    </div>
  </div>
</template>

<script lang="ts">
import { factorLink } from "@factor/ui"
export default {
  components: { pluginSelector: () => import("./selector.vue"), factorLink },
}
</script>
<style lang="postcss" scoped>
.splash {
  text-align: center;
  height: 90vh;
  padding-top: 10em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .splash-content {
    h1 {
      font-size: 3em;
      font-weight: 700;
    }
    .sub {
      color: var(--color-text-secondary);
      font-size: 1.4em;
    }
    .actions {
      margin-top: 2em;
    }
    select {
      font-size: 1.3em;
    }
  }
  .home {
    margin-top: 10em;
  }
}
</style>

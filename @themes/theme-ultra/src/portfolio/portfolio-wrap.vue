<template>
  <div class="portfolio-wrap">
    <router-view />
    <div class="cta">
      <div class="cta-inner">
        <h2>{{ setting("portfolio.cta.headline") }}</h2>
        <factor-link btn="secondary" size="large" :path="setting('portfolio.cta.path')">
          {{ setting("portfolio.cta.text") }}
          <factor-icon icon="arrow-right" />
        </factor-link>
      </div>
    </div>
  </div>
</template>

<script>
import { factorLink } from "@factor/ui"
import { setting } from "@factor/tools/settings"
export default {
  components: { factorLink },
  methods: { setting }
}
</script>

<style lang="less">
.cta {
  padding: 4em 0;
  text-align: center;
  position: relative;
  background: var(--color-primary);
  color: var(--color-white);
  .cta-inner {
    max-width: 650px;
    margin: 0 auto;
  }
  h2 {
    font-size: 2.5em;
    font-weight: 600;
    margin-bottom: 1em;
  }
  .factor-btn {
    letter-spacing: -0.03em;
  }
  @media (max-width: 900px) {
    padding: 4em 2em;
    h2 {
      font-size: 2em;
    }
  }
}
</style>

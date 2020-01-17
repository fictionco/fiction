<template>
  <div class="cta">
    <div class="cta-inner">
      <h2>{{ setting("site.cta.headline") }}</h2>
      <factor-link btn="default" size="large" :path="setting('site.cta.path')">
        {{ setting("site.cta.text") }}
        <factor-icon icon="fas fa-arrow-right" />
      </factor-link>
    </div>
  </div>
</template>

<script lang="txs">
import { factorIcon, factorLink } from "@factor/ui"
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: { factorIcon, factorLink },
  methods: { setting }
})
</script>

<style lang="less">
.cta {
  padding: 4em 0;
  text-align: center;
  position: relative;
  //z-index: 100;
  background: var(--color-primary, #1a49bd);
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
  @media (max-width: 767px) {
    padding: 4em 2em;
    h2 {
      font-size: 2em;
    }
  }
}
</style>

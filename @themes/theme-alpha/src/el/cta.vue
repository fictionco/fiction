<template>
  <section v-if="cta" class="cta">
    <div class="cta-inner">
      <h2 v-if="ctaHeadline">{{ ctaHeadline }}</h2>
      <div v-if="ctaPath" class="buttons">
        <factor-link
          :path="ctaPath"
          class="btn rounded-full bg-blue-500 text-white hover:bg-blue-700"
        >
          {{ ctaText }}
          <factor-icon icon="fas fa-arrow-right" />
        </factor-link>
      </div>
    </div>
  </section>
</template>

<script lang="txs">
import { factorIcon, factorLink } from "@factor/ui"
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: { factorIcon, factorLink },
  data() {
    return {
      loading: true,
      cta: setting("site.cta"),
      ctaHeadline: setting("site.cta.headline"),
      ctaPath: setting("site.cta.path"),
      ctaText: setting("site.cta.text")
    }
  },
  methods: { setting }
})
</script>

<style lang="less">
.cta {
  position: relative;
  z-index: 5;
  margin-top: -90px;
  .cta-inner {
    display: grid;
    grid-template-columns: 7fr 2fr;
    grid-gap: 2rem;
    align-items: center;
    max-width: 1000px;
    margin: 0 auto;
    padding: 4rem 2rem;
    border-radius: 0.5rem;
    color: #fdfdfd;
    background: var(--color-bg-dark) url(../img/pattern.png) repeat center/24%;

    h2 {
      font-size: 2.2em;
      font-weight: var(--font-weight-bold);
    }
    .buttons {
      justify-self: flex-end;
    }
  }

  @media (max-width: 900px) {
    padding: 0 2em 2em;
    .cta-inner {
      grid-template-columns: 1fr;
      h2 {
        font-size: 2em;
      }
      .buttons {
        justify-self: flex-start;
      }
    }
  }
}
</style>

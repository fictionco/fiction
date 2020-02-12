<template>
  <section class="cta">
    <div class="cta-inner">
      <h2>{{ setting("site.cta.headline") }}</h2>
      <div class="buttons">
        <factor-link
          :path="setting('site.cta.path')"
          class="btn rounded-full bg-blue-500 text-white hover:bg-blue-700"
        >
          {{ setting("site.cta.text") }}
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
      font-weight: var(--font-weight-bold, 800);
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

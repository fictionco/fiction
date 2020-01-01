<template>
  <div class="factor-benefits">
    <header class="section-header">
      <h1 class="title">Perfect for Perfectionists</h1>
      <p class="text">
        Factor will help you launch production apps. Minimize time spent re-inventing the wheel or coding (and debugging) where
        it's unneeded.
      </p>
    </header>

    <ul class="features-list">
      <li class="feature-block">
        <home-icon icon="dashboard" />
        <h3 class="title">Dashboard and Posts</h3>
        <p
          class="text"
        >Wield a powerful post system and dashboard to simplify your backend design and add complete content-management.</p>
      </li>

      <li class="feature-block">
        <home-icon icon="build" />
        <h3 class="title">Themes and Plugins</h3>
        <p
          class="text"
        >Factor is designed from the start for theming. Start with a professional foundation; then customize as much as you need.</p>
      </li>

      <li class="feature-block">
        <home-icon icon="open-source" />
        <h3 class="title">Free and Open Source</h3>
        <p class="text">
          Factor uses the same open source license as projects like WordPress
          and Linux.
        </p>
      </li>
    </ul>

    <div class="interstitial-cta">
      <div class="text">
        <h2 class="title">Ready to Try Factor?</h2>
        <h2 class="title-sub">Up and Running in 5 Minutes</h2>
      </div>

      <div class="buttons">
        <factor-link btn="primary" size="large" path="/guide/quickstart">View Quickstart &rarr;</factor-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { factorLink } from "@factor/ui"
import Vue from "vue"

export default Vue.extend({
  components: {
    factorLink,
    "home-icon": () => import("./icon.vue")
  },
  methods: {}
})
</script>
<style lang="less">
.factor-benefits {
  position: relative;

  @media (max-width: 767px) {
    padding-bottom: 80px;
  }

  .section-header {
    font-size: 1em;
    text-align: center;
    max-width: 900px;
    margin: 0 auto;
    margin-bottom: 50px;
    letter-spacing: -0.02em;
    .title {
      font-size: 3em;
      font-weight: 600;
      line-height: 1.1;

      @media (max-width: 670px) {
        font-size: 2em;
        line-height: 1.2;
      }
    }
    .text {
      margin-top: 20px;
      font-weight: 400;
      font-size: 1.3em;
      line-height: 1.6;
    }
    @media (max-width: 767px) {
      text-align: left;
    }
  }
  .features-list {
    font-size: 1.1em;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 2em;
    list-style: none;
    @media (max-width: 767px) {
      grid-template-columns: 1fr;
    }
    .feature-block {
      position: relative;
      .title {
        font-weight: 500;
        font-size: 1.2em;
        line-height: 1.5em;
      }
      .text {
        font-size: 0.94em;
        line-height: 1.7em;
        opacity: 0.85;
      }
      .icon {
        width: 48px;
        height: 48px;

        margin: 10px 0 20px 0;
      }
      h3,
      p {
        margin-bottom: 10px;
      }
      p:last-child {
        margin-bottom: 0;
      }
    }
  }
  .interstitial-cta {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    border-top: 2px solid #f6f9fc;
    margin: 60px -20px 0;
    padding: 60px 20px 0;
    @media (max-width: 767px) {
      grid-template-columns: 1fr;
    }
    .text h2 {
      &.title {
        color: var(--color-primary);
      }
      font-size: 1.5em;
    }
    .buttons {
      margin: 0 0 0 20px;
      @media (max-width: 767px) {
        margin: 20px 0 0 0;
      }
    }
  }
}
</style>

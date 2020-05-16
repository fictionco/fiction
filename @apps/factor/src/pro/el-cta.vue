<template>
  <div class="pro-cta-wrap content">
    <div class="content-pad">
      <div class="pro-cta">
        <div v-if="figure" class="figure-container">
          <component :is="figure" />
        </div>
        <div class="text">
          <h2 class="title">Upgrade to Pro</h2>
          <h2 class="title-sub">Premium features and extensions.</h2>
        </div>

        <div class="buttons">
          <factor-link btn="primary" size="large" path="/plans">Pick a plan &rarr;</factor-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { factorLink } from "@factor/ui"
export default {
  components: {
    factorLink,
  },
  data(this: any) {
    return {
      figure: () => import("./figure-upgrade.vue"),
    }
  },
}
</script>

<style lang="less">
.pro-cta-wrap {
  padding: 0 2rem 6rem;

  @media (max-width: 767px) {
    padding: 6rem 2rem;
  }

  .pro-cta {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    border-top: 2px solid #f6f9fc;
    margin: 0 -20px;
    padding: 2rem 5rem;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.25),
      0 8px 16px -8px rgba(0, 0, 0, 0.3), 0 -6px 16px -6px rgba(0, 0, 0, 0.025);

    @media (max-width: 767px) {
      grid-template-columns: 1fr;
      padding: 2rem;
    }
    @media (max-width: 900px) {
      .figure-container {
        display: none;
      }
    }

    .text {
      margin-left: 3rem;
      @media (max-width: 900px) {
        margin-left: 0;
      }
      h2 {
        &.title {
          color: var(--color-primary);
        }
        font-size: 1.5em;
      }
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

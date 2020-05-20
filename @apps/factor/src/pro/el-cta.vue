<template>
  <div class="pro-cta-wrap content">
    <div class="content-pad">
      <div class="pro-cta">
        <div class="text">
          <h2 class="title">Try Pro Today</h2>
          <div class="sub">No risk, money-back guarantee</div>
        </div>

        <div class="actions">
          <factor-link path="/plans" btn="primary">Upgrade Youe App &rarr;</factor-link>
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
    return {}
  },
}
</script>

<style lang="less">
.pro-cta-wrap {
  padding: 3rem 2rem 6rem;

  .pro-cta {
    overflow: hidden;
    border-radius: 8px;

    text-align: center;
    .text {
      text-align: center;

      font-weight: 700;
      font-size: 1.5em;

      .sub {
        color: var(--color-text-secondary);
      }
    }
    .actions {
      margin-top: 2rem;
    }
  }
}
</style>

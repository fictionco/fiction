<template>
  <div class="pro-cta-wrap content">
    <div class="content-pad">
      <div class="pro-cta">
        <div class="text">
          <h2 class="title">Developer Program</h2>
          <div class="sub">Learn, build, and distribute your themes and plugins.</div>
        </div>
        <div class="actions">
          <factor-link path="https://go.factor.dev/slack" btn="primary">Join &rarr;</factor-link>
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
  padding: 4rem 0 6rem;
  line-height: 1.1;
  text-align: center;

  .pro-cta {
    .title {
      font-size: 3em;
      font-weight: 700;
    }
    .sub {
      font-size: 2em;
      opacity: 0.8;
      margin-top: 1rem;
      color: var(--color-text-secondary);
    }
    .actions {
      margin-top: 2rem;
      font-size: 1.3em;
    }
  }
  @media (max-width: 900px) {
    text-align: left;
    .pro-cta {
      .title {
        font-size: 2em;
      }
    }
  }
}
</style>

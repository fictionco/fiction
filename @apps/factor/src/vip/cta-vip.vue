<template>
  <div class="mast">
    <div class="cta-vip">
      <div>
        <h2 class="title">We’re here to help.</h2>
        <div class="sub">Let’s take your app to the next level.</div>
        <!-- 
        <h1 class="title">
          <span class="subtitle">We’re here to help.</span>
          Let’s take your app to the next level.
        </h1>-->
      </div>
      <div class="buttons">
        <factor-link path="/contact" btn="primary" size="large">Contact Sales &rarr;</factor-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { factorLink } from "@factor/ui"

export default {
  components: { factorLink },
}
</script>

<style lang="less">
.cta-vip {
  display: grid;
  grid-template-columns: 3fr 1fr;
  align-items: center;
  border-bottom: 2px solid rgba(207, 215, 223, 0.25);
  padding: 2em 0;
  .title,
  .sub {
    font-size: 2em;
  }
  .title {
    font-weight: var(--font-weight-bold, 700);
    line-height: 1.3;
  }
  .sub {
    font-weight: 400;
    color: var(--color-text-secondary);
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
    .factor-btn + .factor-btn {
      margin-left: 10px;
    }
  }
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    .buttons {
      justify-content: flex-start;
    }
  }
}
</style>

<template>
  <div v-if="!userId()" class="mast">
    <div class="cta-vip">
      <div>
        <h1 class="title">
          <span class="subtitle">We’re here to help.</span>
          Let’s take your app to the next level.
        </h1>
      </div>
      <div class="buttons">
        <factor-link
          path="/contact"
          btn="primary"
          size="large"
        >Contact Sales &rarr;</factor-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { factorLink } from "@factor/ui"
import { userId } from "@factor/user"
import Vue from "vue"

export default Vue.extend({
  components: { factorLink },
  methods: { userId },
})
</script>

<style lang="less">
.cta-vip {
  display: grid;
  grid-template-columns: 3fr 1fr;
  align-items: center;
  border-bottom: 2px solid rgba(207, 215, 223, 0.25);
  padding: 2em 0;
  .title {
    font-weight: 400;
    font-size: 30px;
    line-height: 45px;
    color: var(--color-primary);
    margin: 0.75em 0;
  }
  .subtitle {
    font-weight: 300;
    color: #32325d;
    display: block;
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
